---
author: RealTong
pubDatetime: 2023-04-12T12:15:00+08:00
modDatetime: 2023-04-12T12:18:00+08:00
title: 自动签发 Google 提供的免费 SSL 证书
slug: issue-google-public-cert
featured: false
draft: false
tags:
  - DevOps
  - Free service
description: 自动签发 Google 提供的免费 SSL 证书
---

## Table of contents

Google 去年[宣布](https://cloud.google.com/blog/products/identity-security/automate-public-certificate-lifecycle-management-via--acme-client-api)推出了免费的公共证书服务，和 Let's Encrypt 一样，最高支持 90 天有效期。

一些特性:

- 支持通配符证书
- 支持 ECC 和 RSA 证书
- 最长 90 天有效期
- 最多 100 的域名

## **申请证书**

### **获取 API key**

1. 在 [GCP](https://cloud.google.com/) 面板上激活一个 CloudShell，键入以下命令，可能会提示需要授权。

   ```
   gcloud beta publicca external-account-keys create
   ```

2. 复制返回信息中 `b64MacKey` 和 `keyId`

   ```
   Created an external account key
   [b64MacKey: xxxxxxxxxxxxxxxxxxxxxxx
   keyId: xxxxxxxxxxxxxxx]
   ```

### **使用 acme.sh 自动签发**

我的域名托管在 Cloudflare，所以可以使用 DNS API 来签发，`acme.sh` 支持 Cloudflare、dnspod、aliyun、name.com 等多种域名服务商, 可以在这里查看所有的支持 [https://github.com/acmesh-official/acme.sh/wiki/dnsapi](https://github.com/acmesh-official/acme.sh/wiki/dnsapi)

1. 设置默认 CA

   > 注: acme.sh 默认CA 为 ZeroSSL

   ```
   acme.sh --set-default-ca --server google
   ```

2. 注册账户

   > 注: mackey和keyid只能使用一次, 第二次注册账户会提示「Register account Error: {"type":"urn:ietf:params:acme:error:unauthorized","detail":"Unknown external account binding key."}」

   ```
   acme.sh --server google --register-account  -m ${EMAIL} --eab-kid ${KEYID} --eab-hmac-key ${MACKEY}
   ```

3. 签发证书

   ```
   acme.sh --issue --dns dns_cf -d mydomain.com -d *.mydomain.com
   ```

4. 安装证书

   ```
   acme.sh --install-cert -d mydomain.com \
   --key-file       /path/to/private.key  \
   --fullchain-file /path/to/fullchain.pem \
   --reloadcmd     "nginx -s reload"
   ```
