---
author: RealTong
pubDatetime: 2024-02-29T15:22:00Z
modDatetime: 2024-02-29T15:22:00Z
title: 家庭无污染DNS配置指南
slug: dns-configuration
featured: false
draft: false
tags:
  - Network
description:
    本文介绍了如何使用 MosDNS、AdGuardHome、OpenClash 配置家庭无污染 DNS。从此告别广告、恶意网站、垃圾信息、DNS 污染。
---
## Table of contents

## 背景
我经常发现某些网站打不开，或者打开后提示证书错误，比如访问 google.com 会跳出一个警告页面，提示证书错误，显示的是 Facebook 证书，这是因为 DNS 污染导致的。DNS 污染是指在 DNS 解析过程中，DNS 服务器返回了错误的 IP 地址，导致用户访问了错误的网站。这种情况通常是因为网络运营商或者公共 DNS 服务器对 DNS 请求进行了劫持，返回了错误的 IP 地址。这种情况下，用户访问的网站可能是广告网站、恶意网站、垃圾信息网站，甚至是钓鱼网站。为了解决这个问题，我们可以使用 MosDNS、AdGuardHome、OpenClash 配置家庭无污染 DNS。

## 配置前的准备
- luci-app-openclash
- luci-app-adguardhome
- luci-app-mosdns


## 效果
- 无广告 ✅
- yacd 显示域名 ✅
- AdGuardHome 显示域名 ✅
- OpenClash 分流正常 ✅
- 无污染 DNS ✅

## 配置步骤

### OpenClash 设置
- redir-host 兼容
- DNS 设置
  - DNS 劫持 防火墙转发
  - 自定义 DNS (nameserver 和 fallback)设置为 127.0.0.1:53

### MosDNS 设置
- 监听端口为 5335

### AdGuardHome 设置
- 重定向为 无
- 监听端口为 1745
- 上游 DNS 设置为 MosDNS （127.0.0.1:5335）的端口