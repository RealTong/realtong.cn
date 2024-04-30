---
author: RealTong
pubDatetime: 2024-02-25T15:22:00+08:00
modDatetime: 2024-02-25T09:12:47+08:00
title: YubiKey 使用
slug: yubikey-guide
featured: false
draft: false
tags:
  - YubiKey
  - SSH
  - PGP
description: YubiKey 入门指南，介绍如何使用 YubiKey 进行 SSH 登录、commit 签名等操作。
---

## Table of contents

## YubiKey 功能简介

YubiKey 目前支持 WebAuthn、FIDO2 CTAP1、FIDO2 CTAP2、Universal 2nd Factor (U2F)、Smart card (PIV-compatible)、Yubico OTP、OATH – HOTP (Event)、OATH – TOTP (Time)、Open PGP、Secure Static Password 等多种功能。其中 FIDO2、2FA 和 U2F 是用于身份验证的功能，OpenPGP 和 PIV 是用于加密和签名的功能，OTP 是用于一次性密码的功能。

Yubico 官方还在官方的 [下载中心](https://www.yubico.com/support/download/) 提供了 `YubiKey Manager` 用于管理 YubiKey，`YubiKey Authenticator` 用于管理 OTP。目前 如果想玩硬件密钥的话，YubiKey 是一个不错的选择，开源的方案可以选择 [Canokey](https://www.canokeys.org/)

我目前使用 YubiKey 已经一年有余，主要用于 服务器登录、commit 签名 等等，并没有使用 PIV ，PIV 可以用于 Windows 无密码登录。下面我将介绍如何使用 YubiKey 进行这些操作。

YubiKey 还支持触摸，可以使用 `  Yubikey Manager` 来管理，请按，长按 等操作。

## 将 YubiKey 用于服务器登录（SSH）

### 方法1 （OpenPGP）

先来了解一下 PGP，PGP 支持很多功能，其中包括签名、加密、认证等。下面是一些常见的缩写：
| 缩写 | 全称 | 作用 |
| --- | --- | --- |
| [C] | Certificating | 认证其他密钥，比如签署一个子密钥。 |
| [S] | Signing | 签名。证明某数据没有被篡改。例如文件签名，git commit 签名。 |
| [A] | Authenticating | 认证。比如 SSH 登录。 |
| [E] | Encrypting | 加密。 |

#### 创建一个 PGP 密钥对

1. 将 YubiKey 插入电脑
2. 打开终端，输入 `gpg --card-edit admin` 进入 YubiKey 的管理界面，YubiKey 默认的 PIN 是 `123456`, 管理员的 PIN 是 `12345678`。
   可以使用 passwd 命令来修改默认的 PIN 码
3. 创建 PGP 密钥对：

```bash
gpg --gen-key
# 创建主密钥
# 选择 `RSA and RSA`，选择 `4096` 位，选择 `0` 为过期时间，输入你的姓名和邮箱，输入密码，完成密钥对的创建。

# 创建子密钥
gpg --edit-key 0xABC # 进入密钥编辑界面
addkey # 添加子密钥
# 再来一遍上面的流程，注意选择 `S` 或者 `A` 作为用途，最终得到一个主密钥下有三个不同功能的子密钥。
```

4. 将PGP密钥导入到 YubiKey

```bash
# 设置名称
gpg --edit-key 0xXXXXXXXXXXXXXXXXXXXXXX # 进入密钥编辑界面
key 1 # 选择要操作的密钥
keytocard 1 key 1 # 将签名密钥导出到 YubiKey
key 2 # 选择要操作的密钥
keytocard 2 key 2 # 将加密密钥导出到 YubiKey
key 3 # 选择要操作的密钥
keytocard 3 key 3 # 将认证密钥导出到 YubiKey
quit # 退出编辑界面
```

5. 这样，我们就把 PGP 密钥导入到了 YubiKey 中，可以使用相同的方法把密钥导入到其他 YubiKey 中。比如你的备份 YubiKey。

#### 使用 YubiKey 进行 SSH 登录

1. 首先，我们使用 `ssh-add -L` 将 YubiKey 的公钥导入到服务器的 `~/.ssh/authorized_keys` 文件中。
2. 然后配置 gpg-agent。在 Terminal 中输入 `brew install pinentry-mac` 安装 pinentry-mac，然后在 `~/.gnupg/gpg-agent.conf` 中添加

```bash
pinentry-program /opt/homebrew/bin/pinentry-mac
enable-ssh-support
use-standard-socket
default-cache-ttl 600
max-cache-ttl 7200
```

3. 设置环境变量(或者添加到 .zshrc 或者 .bashrc 中)

```bash
export GPG_TTY="$(tty)"
export SSH_AUTH_SOCK=$(gpgconf --list-dirs agent-ssh-socket)
gpgconf --launch gpg-agent
```

4. 重启 gpg-agent

```bash
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent
```

这样在使用 SSH 登录的时候，会弹出一个窗口，提示你输入 YubiKey 的 PIN 码，输入正确的 PIN 码后，就可以登录了。每次电脑解锁后都需要重新输入一次 PIN 码，之后每次触摸 YubiKey 上的金属触点就可以了。

### 方法2 （FIDO2）

这里其实还是分两种方法，

1. 密钥对存储在 YubiKey 中
2. 密钥对存储在电脑中
   这里我只介绍第一种方法，这样我们每次带上 YubiKey，随时随地都可以登录服务器了。第二种方法可以参考 [这篇文章](https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html)

3. 插入 YubiKey 输入 `ssh-keygen -t ed25519-sk -O resident -O application=ssh:YourTextHere -O verify-required`
4. 按照命令行的提示完成密钥创建
5. 将 `ssh-add -L` 获取的ssh公钥导入到服务器的 `~/.ssh/authorized_keys` 文件中
6. 修改客户端的 `~/.ssh/config` 文件，添加

```bash
Host myHost
    HostName host.example.com
    User root
    Port 22
    IdentityFile /Users/realtong/.ssh/RealTong-Yubikey-5C
```

## 将 YubiKey 用于 commit 签名

1. `gpg --list-secret-keys --keyid-format LONG` 获取 GPG key ID
2. `git config --global user.signingkey XXXXXXXXXXX` 设置每次 commit 使用的 GPG key ID
3. 在 Github > Settings > SSH and GPG keys > New GPG key 中添加 GPG key
4. `git commit` 每次 commit 都会弹出一个窗口，提示你输入 YubiKey 的 PIN 码，输入正确的 PIN 码后，就可以提交了。经过签名的 commit 显示一个小绿锁。

## 小 Tips

- 如果你的 YubiKey 丢失了，并且没有备份，那么你就准备跑路吧。
- 上传到 Github 的 GPG public key 可以通过 `curl https://github.com/RealTong.gpg | gpg --import` 导入到本地。
- 上传到 Github 的 SSH public key 可以通过 `curl https://github.com/RealTong.keys ` 获取

## 参考

- [YubiKey 使用指南](https://developers.yubico.com/PIV/Guides/Securing_SSH_with_OpenPGP_or_PIV.html)
- [YubiKey Guide](https://github.com/drduh/YubiKey-Guide)
