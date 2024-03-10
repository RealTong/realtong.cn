---
author: RealTong
pubDatetime: 2024-03-09T01:32:00Z
modDatetime: 2024-03-09T01:32:00Z
title: 使用 Authentik 为自部署服务添加 SSO 支持
slug: authentik-sso
featured: false
draft: false
tags:
  - Tools
  - HomeLab
description:
  Authentik 是一个开源的 SSO 解决方案，可以用于为自部署服务添加 SSO 支持。我在内网环境中使用 Authentik 为一些服务添加了 SSO 支持，这里记录一下配置过程。
---


## Table of contents


## 什么是 Authentik

(Authentik)[http://github.com/goauthentik/authentik/]  是一个开源的认证服务提供商，类似的服务还有 Authing，0auth，Auth0 等。Authentik 提供了一个 Web 界面，可以用于管理用户、登录、授权等功能。

## 环境介绍

我的 HomeLab 宿主机是一个 N5105 的 All in one，安装了 PVE(Proxmox VE) 虚拟了一个 OpenWRT、Ubuntu server。

其中 Ubuntu server 是我主要用来放服务的地方，全部是由 Docker 容器组成的，部署了 Bitwarden、Portainer、Grafana、HomeAssistant 等服务。
网络部分：内网 10.0.0.1:53 有一个 DNS 服务器，内网使用 mkcert 签名了一个 *.wst.sh 的证书，用于内网的 HTTPS 访问，并使用了 Nginx 反向代理到各个服务。

| 服务 | 域名 |
| --- | --- |
| Bitwarden | pwd.wst.sh |
| Portainer | docker.wst.sh |
| Grafana | dash.wst.sh |
| HomeAssistant | ha.wst.sh |
| Authentik | auth.wst.sh |
| Proxmox VE | pve.wst.sh |

目前只有 PVE、Portainer、Grafana 支持 SSO，所以本文为这三个服务添加 SSO 支持。

## 安装 Authentik
```yaml
version: "3.4"

services:
  sauthentik-server:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2024.2.2}
    restart: always
    command: server
    networks:
      - service_network
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_REDIS__DB: 1
      AUTHENTIK_REDIS__PASSWORD: <YOUR REDIS PASSWORD>
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_POSTGRESQL__USER: <YOUR PG USERNAME>
      AUTHENTIK_POSTGRESQL__NAME: postgres
      AUTHENTIK_POSTGRESQL__PASSWORD: <YOUR PG PASSWORD>
      AUTHENTIK_SECRET_KEY: <openssl rand -base64 36>
    volumes:
      - ./media:/media
      - ./custom-templates:/templates
    ports:
      - "9000:9000"
      - "9443:9443"
  authentik-worker:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2024.2.2}
    restart: always
    command: worker
    networks:
      - service_network
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_REDIS__DB: 1
      AUTHENTIK_REDIS__PASSWORD: <YOUR REDIS PASSWORD>
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_POSTGRESQL__USER: <YOUR PG USERNAME>
      AUTHENTIK_POSTGRESQL__NAME: postgres
      AUTHENTIK_POSTGRESQL__PASSWORD: <YOUR PG PASSWORD>
      AUTHENTIK_SECRET_KEY: <openssl rand -base64 36>
    user: root
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./media:/media
      - ./certs:/certs
      - ./custom-templates:/templates

networks:
  service_network:
    external: true
```
我在 Docker 里创建了一个 Network（service_network），用于所有容器之间的通信，这样就可以使用容器名来访问其他容器了。

使用上面的 docker-compose.yml 文件，可以创建一个 Authentik 服务。同时可以为 Authentik 服务配置一个 Nginx 反向代理，用于 HTTPS 访问。
```plaintext
upstream auth {
  zone auth 64k;
  server sauthentik-server:9000;
  keepalive 2;
}
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      "";
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name auth.wst.sh;

    if ($host = auth.wst.sh) {
        return 301 https://$host$request_uri;
    }
    return 404;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name auth.wst.sh;

    # 这里就是使用 mkcert 自签的的证书（*.wst.sh）
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    client_max_body_size 525M;

    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;

      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_pass http://auth;
    }
}
```
然后在 DNS 服务器里配置一下，将 auth.wst.sh 指向 Nginx，这样就可以通过 HTTPS 访问 Authentik 了。

## 配置 Authentik
首先访问 `https://<YOUR DOMAIN>/if/flow/initial-setup/` 进行初始化设置，设置完成后，就可以登录 Authentik 了。

## 为服务添加 SSO 支持

### Proxmox VE

#### 创建 OAuth2 提供程序
首先创建一个提供程序，在 Authentik 的 Web 界面中，点击 `管理员界面` -> `提供程序` -> 选择`OAuth2/OpenID Provider`，填写 `名称`、`身份验证流程`、`授权流程`。
其中，身份验证流程就是登录的方式，授权流程就是授权的方式，这里都可以是默认的，之后也可以自己配置 flow。

`重定向 URI/Origin（正则）` 这里写 PVE 的地址，例如 `https://pve.wst.sh`。
`客户端 ID` 和 `客户端密钥` 这两个是 PVE 需要的，所以需要在 PVE 中配置。

#### 创建应用程序
在 Authentik 的 Web 界面中，点击 `管理员界面` -> `应用程序` -> 选择`OAuth2/OpenID Client`，填写 `名称`、`slug`、`提供程序`。

其中 `提供程序` 选择我们刚才创建好的提供程序。

#### 配置 PVE
在 PVE 的 Web 界面中，点击 `数据中心` -> `权限` -> `领域` -> `添加` -> `OpenID 连接服务器`。

发行人 URL 可以在 `提供程序` 的 OpenID 配置 URL 中找到，例如 `https://auth.wst.sh/application/o/proxmox/.well-known/openid-configuration`。但是我们填写的时候只需要填写 `https://auth.wst.sh/application/o/proxmox/`。
其他的参数 Authentik 的提供程序里都可以看到。

当然，还可以用命令来设置。
```bash
pveum realm add Authentik --type openid --issuer-url https://auth.wst.sh/application/o/proxmox/ --client-id '<YOUR CLIENT ID>' --client-key '<YOUR CLIENT KEY>' --username-claim username --autocreate 1
```

注意⚠️：发行人 URL 还有一些需要注意的地方，比如，如果是自签证书的话，需要在 PVE 里添加证书的 CA，这样 PVE 才能信任 Authentik 的证书。不然一直会报错 500。

在 PVE 里添加 CA 的方法是，将自签证书放在 /usr/local/share/ca-certificates 下面的 .crt 文件中，然后执行 update-ca-certificates 命令，这样就可以将自签证书添加到系统的信任列表中了。

可以使用 `wget https://auth.wst.sh/application/o/proxmox/.well-known/openid-configuration` 来测试是否可以访问到 Authentik。

回到 PVE 的登录界面，选择 Authentik 的登录方式，输入 Authentik 的用户名和密码，就可以登录 PVE 了。如果没有预先创建用户，则 PVE 会自动创建一个叫 `username:authentik` 的用户。

可以在 `数据中心` -> `权限` -> `添加` 里为刚才登录的用户（username:authentik）添加权限。

### Portainer
为 Portainer 添加 SSO 支持的步骤和 PVE 类似，只是在创建 OAuth2 提供程序的时候，`重定向 URI/Origin（正则）` 这里写 Portainer 的地址，例如 `https://docker.wst.sh`。

但是 Portainer 配置比 PVE 多一些，需要在 Portainer 的 Web 界面中，点击 `Settings` -> 开启 `Use SSO`。然后选择 OAuth -> `Custom`。很多选择可以和 Authentik 的提供程序中对应起来，这里就比一一讲了。

但是这里的 User identifier 需要填写 `email`，Scopes 需要填写 `email openid profile`。


Portainer 也要信任 auth.wst.sh，不然会一直报错登录失败，也不告诉你原因。

其实把 CA 证书放在 /usr/local/share/ca-certificates 下面的 .crt 文件中，然后添加一个环境变量`SSL_CERT_FILE: /usr/local/share/ca-certificates/<YOUR FILENAME>.crt` 重启 Portainer 就可以了。

### Grafana
配置 Grafana 的 SSO 支持和其他的类似。这里还是只记录 Grafana 端的配置。

Grafana 需要编辑 grafana.ini 文件，添加如下配置。
```ini
[server]
root_url = https://dash.wst.sh # 这里填写访问 Grafana 的地址

[auth.generic_oauth]
name = Authentik
enabled = false
client_id = <YOUR CLIENT ID>
client_secret = <YOUR CLIENT SECRET>
auth_url = # Authentik 上的
token_url = # Authentik 上的
api_url = # Authentik 上的
scopes = openid email profile
role_attribute_path = "contains(groups, 'HomeLabOwner') && 'Admin' || contains(groups, 'HomeLabVisitor') && 'Viewer'"
auto_login = false
```

这里 role_attribute_path 是用来配置权限的，可以根据 Authentik 的用户组来配置权限。

我这里的意思是说，如果用户在 Authentik 的用户组中有 `HomeLabOwner`，那么就给他 `Admin` 权限，如果用户在 Authentik 的用户组中有 `HomeLabVisitor`，那么就给他 `Viewer` 权限。

这样就可以为 Grafana 添加 SSO 支持了。

## 总结
Authentik 是一个很好用的 SSO 解决方案，可以为自部署服务添加 SSO 支持。但是配置起来还是有一些麻烦的地方，比如证书的问题，还有一些配置的地方不是很明确。
