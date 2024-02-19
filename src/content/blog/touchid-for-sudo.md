---
author: RealTong
pubDatetime: 2024-02-17T08:15:00Z
modDatetime: 2024-02-17T08:18:00Z
title: 使用 Touch ID 为 sudo 添加指纹验证
slug: touchid-for-sudo
featured: false
draft: false
tags:
  - DevOps
  - macOS
  - Security
description:
    使用 Touch ID 为 sudo 添加指纹验证
---

在 macOS Sonoma (14.0) 上，Apple 为 「使用Touch ID 认证 sudo」提供了开箱即用的支持，只需3行命令即可开启

1. `sudo cp /etc/pam.d/sudo_local.template /etc/pam.d/sudo_local`
2. `sudo chmod +w /etc/pam.d/sudo_local`
3. `sudo vim /etc/pam.d/sudo_local`
4. 取消第 3 行的注释即可

在弹出 TouchID 认证的对话框时，Apple Watch 会同时响应，也可以通过双击Apple Watch 侧边按钮进行认证。

遗憾的是，当合上 MacBook 并使用外接显示器时，由于检测不到 Touch ID，也不会弹出 Apple Watch 认证，所以需要手动输入密码来认证

如果实在想要使用 Apple Watch 来认证，可以使用第三方工具 [pam-watchid](https://github.com/biscuitehh/pam-watchid) 来实现，但需要注意的是，当使用 第三方 watchID 的方案时，更新系统可能会导致需要重新设置。