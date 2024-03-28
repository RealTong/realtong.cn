---
author: RealTong
pubDatetime: 2024-03-11T01:32:00Z+08:00
modDatetime: 2024-03-11T01:32:00Z+08:00
title: 为 Authentik 添加 Passwordless 支持
slug: authentik-passwordless
featured: false
draft: false
tags:
  - Tools
  - HomeLab
description:
  使用 Passwordless 可以为 Authentik 添加无密码登录支持，只需要验证 YubiKey 或者 iPhone 就可以登录任何通过 Authentik 验证的服务。  
---


## Table of contents


## 配置
Authentik 使用「流程」和「阶段」，流程是一系列阶段的集合，阶段是一系列步骤的集合。

### 创建一个用于 认证 的流程
1. 点击「流程」，然后点击「创建流程」, 「指定」选择「身份认证」。
2. 点击刚才创建的流程，然后点击「阶段绑定」，点击「创建与绑定阶段」, 类型选择「Authenticator Validation Stage」，点击下一步，设备类型选择「WebAuthn」身份验证器，
3. 然后再添加一个流程，类型选择「User Login Stage」，然后在应用提供程序选择对应的流程。
