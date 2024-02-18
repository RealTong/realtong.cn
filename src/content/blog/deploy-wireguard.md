---
author: RealTong
pubDatetime: 2022-07-21T15:22:00Z
modDatetime: 2022-07-21T15:22:00Z
title: 使用 WireGuard 部署私人 VPN
slug: deploy-wireguard
featured: false
draft: false
tags:
  - VPN
  - Network
  - HomeLab
  - WireGuard
description:
  WireGuard 是一个快速、现代、安全的 VPN 协议，我将搭建一个贯穿 Home，Office，Cloud 的 WireGuard 网络。
---
> 从 2023.12.21 穿越回来，文章从我的 Noiton 迁移过来，可能年久失修，但是内容还是有参考价值的。



## **公网 v4 减少，公网 v6 迟迟不能普及。如何实现远程开发?**

1. 向日葵，蒲公英 等软件解决方案服务商（不安全且慢（2022年还是1Mbps））
2. frp, nps 等开源 C/S 内网穿透 （配置繁琐且慢（ Go 语言编写））
3. 华为, 思科等 VPN 硬件解决方案提供商（一个字 贵. 当然这是我的原因）
4. OpenVPN等组网利器配置超级繁琐. 慢
5. Tailscale 和 ZeroTier （配置简单 需要付费, 免费版有设备数量限制. 中继服务器在国外. 自建节点则不支持iOS iPadOS 如果打洞不成功则可能失联. TailScale 是基于 WireGuard 的所以嘛 嘿嘿嘿）
6. WireGuard（不过配置简单而且快. 也可以NAT to NAT. 没有数量限制. 全平台,支持自定IP）

## **WireGuard是什么**

> WireGuard 是一个易于配置、快速且安全的开源 VPN，它利用了最新的加密技术。目的是提供一种更
快、更简单、更精简的通用 VPN，它可以轻松地在树莓派这类低端设备到高端服务器上部署。 
linux.cn
> 

## **有什么好处?**

1. 跨平台
2. 配置简单, 可以直接使用默认值
3. 能够在网络故障恢复之后自动重连
4. 以 Linux 内核模块的形式运行, 资源占用小
5. WireGuard 已被并入 Linux 5.6+ 内核 意味着非常容易安装
6. 安全, 使用了更先进的加密技术，具有前向加密和抗降级攻击的能力。WireGuard 使用 Chacha20 进行对称加密, 使用 Poly1305 进行数据验证.利用 Curve25519 进行密钥交换。使用 BLAKE2 作为哈希函数。使用 HKDF 进行解密。WireGuard 对外只暴露了一个 UDP 端口

## **如何配置**

首先看一下我的网络拓扑图

公司网络和家庭网络都通过ISP(网络服务提供商)接入互联网, 实现访问百度等日常生活所需, 所有的终端设备(PC, mac, Phone) 都通过路由器DHCP下发IP来上网. **Note: 公司局域网和家庭局域网的IP网段必须不同(这在接下来的步骤非常重要)**

### **开始配置 WireGuard**

1. 安装 WireGuard
    
    如果你的 Linux 内核 5.6, 则可以使用如下方式
    
    ```bash
    sudo apt update
    
    sudo apt install wireguard
    
    # 本文是以Ubuntu 22.04为例, 各个发行版大同小异.如ArchLinux可以使用pacman或者AUR, centos可以使用yum
    ```
    
2. 开启服务器端口转发
    
    ```bash
    # 查看转发情况 如果返回1,说明IP转发已经开启
    sudo sysctl net.ipv4.ip_forward
    
    # 开发IP转发
    sudo sysctl -w net.ipv4.ip_forward=1
    
    # 如果是IPV6 地址可以使用
    sudo sysctl net.ipv6.conf.all.forwarding
    ```
    
3. 编辑服务端配置文件
    
    > WireGuard其实不分Client/Server,在WireGuard中统称为Peer. 所有的节点都是Peer. 但本 文为了方便理解还是区分Client/Server.
    > 
    1. 首先生成一对密钥
        
        ```bash
        wg genkey | tee server-priv-key | wg pubkey > server-pub-key
        # wg genkey 是官方提供的密钥生成工具
        ```
        
    2. 编辑配置
        
        WireGuard安装好之后会默认创建一个/etc/wireguard文件夹, 该文件夹所有人为root
        
        ```bash
        # vim /etc/wireguard/wg0/conf
        
        [Interface]
        PrivateKey = 上一步生成的私钥(server-priv-key)
        Address = 10.0.0.1/24
        PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o
        wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
        PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o
        wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
        ListenPort = 51820
        DNS = 223.5.5.5
        MTU = 1420
        
        # Address为wg内网的IP网段
        # ListenPort 为UDP监听端口. 接入WireGuard虚拟局域网需要通过此端口,如果使用云服务器需要在管理面板中放行
        # PostUp 和 PostDown为在启动之前需要做什么 以及 在关闭之后需要做什么 这里为一些iptables规则(需要将eth0更换为实际网络出口名称)
        ```
        
        这样一份Server端的配置就可以启动WireGuard了
        
    3. 启动
        
        使用 `wg-quick up wg0`命令, WireGuard会自动去`/etc/wireguard`目录下找以wg0开头的.conf文件(说明我们可以同时设置多个WireGuard)
        
    4. 验证
        
        使用wg会显示当前所有已启动WireGuard接口下Peer的连接信息, 包含流量信息
        
        当然我们上面的配置文件中没有添加Peer, 所以你使用wg看不到相关的设备
        

### **我们稍微更改一下配置**

```bash
# 为Peer生成一对密钥

wg genkey | tee home-ubuntu-priv-key | wg pubkey > home-ubuntu-pub-key

# vim /etc/wireguard/wg0.conf

[Interface]
PrivateKey = 上一步生成的私钥(server-priv-key)
Address = 10.0.0.1/24
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
ListenPort = 51820
DNS = 223.5.5.5
MTU = 1420

# Home Ubuntu
[Peer]
PublicKey = 生成的密钥(home-ubuntu-pub-key)
AllowedIPs = 10.0.0.2/32, 192.168.0.0/24
```

这样就给服务端配置了第一个客户端 `Peer` 了

接下来需要在客户端 `Peer` 进行配置, 是的WireGuard连通

```bash
# vim /etc/wireguard/ubuntu.conf

[Interface]
PrivateKey = 客户端私钥(home_ubuntu_priv_key)
Address = 10.0.0.2/32
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o wlp1s0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o wlp1s0 -j MASQUERADE
DNS = 223.5.5.5
MTU = 1420

[Peer]
PublicKey = 服务端公钥(server-pub-key)
Endpoint = 服务器的IP地址:51820(可以是域名)
AllowedIPs = 10.0.0.0/24, 192.168.0.0/32
PersistentKeepalive = 25

# AllowedIPs 为可以经过的IP地址. 简单理解为分流 如0.0.0.0/0 则所有IP都会经过WireGuard. 这里配置了WireGuard的网段和家中网段
# 如果需要访问内网中的其他设备则需要打开ip转发. 参考安装第2步. 注意Postup和PostDown中wlp1s0更换为出口网卡名称
```

客户端就配置好了, 接下来先将服务端重启(修改配置后需要重启WireGuard) `wg-quick down wg0`

服务端: `wg-quick up wg0`

客户端: `wg-quick up ubuntu`

这样就可以组成一个虚拟局域网, 此时可以在Server中 `ping 10.0.0.2` (Home-Ubuntu) 也可以 `ping 192.168.0.104` (Home-Windows). 当然都是可以ping通的. 如果不通可以检查IP 转发有没有打开或者使用 `tcpdump -i wg0` 抓包看看

最后再增加一个两个Peer. 服务端的配置就是这样:

```bash
[Interface]
PrivateKey = 上一步生成的私钥(server-priv-key)
Address = 10.0.0.1/24
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
ListenPort = 51820
DNS = 223.5.5.5
MTU = 1420

# Home Ubuntu
[Peer]
PublicKey = 生成的密钥(home-ubuntu-pub-key)
AllowedIPs = 10.0.0.2/32, 192.168.0.0/24

# Office-Windows
[Peer]
PublicKey = 生成的密钥(office-windows-pub-key)
AllowedIPs = 10.0.0.4/32

# Office-Linux
[Peer]
PublicKey = 生成的密钥(office-linux-pub-key)
AllowedIPs = 10.0.0.5/32, 192.168.1.0/24

# 注意 Office-Windows 这台设备的 AllowedIPs 没有公司的内网网段（192.168.1.0/24）原因是因为最好不要再 WireGuard 中存在两个相同的网段. 否则 WireGuard 则不知道该将 IP 打向哪台设备
```

最后也可以使用 Home-Ubuntu 访问位于公司的 `192.168.1.0/24` 网段. 可以试试 `ping 192.168.1.2`

**最终的网络拓扑如下**
*使用虚线表示 WireGuard*

![网络拓扑图](@assets/images/posts/deploy-wireguard/network-diagram.png)

### 一些建议

1. 服务器防火墙只放开 UDP 的 WireGuard 端口x
2. 建议不要使用默认的 51820 端口
3. 不要再 WireGuard 中出现相同的网段
4. 建议再路由器上使用 WireGuard, 这样路由器下其他设备不需要安装 WireGuard 也可以访问所有的内网（WireGuard 还比较年轻, 一些路由器还不支持WireGuard. 可以自己编译 OpenWRT 路由系统）
5. WireGuard 使用 UDP 协议, 可能遭遇 UDP QOS 情况. 可以使用 [udp2raw](https://github.com/wangyu-/udp2raw) 进行 UDP 伪装（在山东联通-腾讯云北京机房没有遭遇过 UDP QOS 的情况 即使是大流量看视频的情况下）

## **Reference**

My WireGuard config : [WireGuard Conf Example](https://github.com/RealTong/Profile/tree/main/Conf/WireGuard/)

procustodibus blog :  [WIREGUARD POINT TO SITE CONFIGURATION](https://www.procustodibus.com/blog/2020/11/wireguard-point-to-site-config/)