---
author: RealTong
pubDatetime: 2024-03-01T03:24:00Z
modDatetime: 2024-03-01T03:24:00Z
title: What's in my Raycast
slug: what-s-in-my-raycast
featured: false
draft: false
tags:
  - Tools
description:
    本文介绍了我在 Raycast 中使用的插件和脚本，以及它们的用途和配置。
---

## Table of contents


## What is Raycast
[Raycast](https://www.raycast.com/) 是 macOS 的一款生产力工具，还是一款启动器，它有丰富的插件市场，可以从 [Raycast Store](https://www.raycast.com/store) 中安装各种插件。当然，如果你是一个开发者，你也可以使用 React 来根据 Raycast 的 [API](https://developers.raycast.com/) 来开发自己的插件。我自己开发了一款 [LoL Esports](https://github.com/RealTong/lol-esports-for-raycast) 的插件，可以查看英雄联盟的比赛信息。

![LoL Esports](@assets/images/posts/what-in-my-raycast/lol-esports-demo.png)

事不宜迟，让我们来看看 What's in my Raycast!

## Built-in Features
### App 启动器
Raycast 可以完美平替 Spotlight，所以我用 `⌘ + Space` 来呼出 Raycast。用来启动 macOS 中的任何应用程序。

### Calculator
Raycast 的计算器功能非常强大，可以进行各种复杂的数学计算，还可以进行单位换算、颜色转换、货币换算、时区转换等。当然还有很多我没有发掘的功能。

![Calculator](@assets/images/posts/what-in-my-raycast/raycast-calculator.png)

### Search Emoji & Symbols
Raycast 中内置了 Emoji 搜索功能，还可以搜索 Symbol。升级 Raycast Pro 之后，还可以使用 AI 搜索功能。提供了更准确的搜索结果。

我使用 `⌥ + E` 来呼出 Emoji 搜索面板。

### Clipboard History
Raycast 内置了非常强大的剪切板历史功能，相较于 Paste 等付费应用，功能可是一点也不逊色。可以查看剪贴板历史记录，还可以搜索剪贴板历史记录、根据内容分类查找。还显示从什么应用中复制而来。如果复制过链接，图片，还可以直接在 Raycast 中预览。
免费用户可以查看最近 30 天的剪贴板历史记录。Pro 用户可以查看所有的剪贴板历史记录。并且可以再多台设备之间同步剪贴板历史记录。

我使用 `⌥ + V` 来呼出剪贴板历史记录。


## Extensions
### What extensions do I use
Raycast 的插件市场非常丰富，可以满足各种需求。以下是我最长使用的插件：

- [Apple Reminders](https://www.raycast.com/raycast/apple-reminders)
  > 使用 Raycast 快速查看和管理 Apple Reminders 中的任务。
- [CleanShot X](https://www.raycast.com/Aayush9029/cleanshotx)
  > 和 Raycast 强大的快捷键功能结合，可以快速截图并编辑。
- [DocSearch](https://www.raycast.com/raycast/docsearch)
  > 开发文档快速搜索
- [Kill Process](https://www.raycast.com/rolandleth/kill-process)
  > 快速杀死进程
- [Search Browser Bookmarks]()
  > 快速搜索浏览器书签，支持Arc，Chrome，Safari。
- [Window Management]()
  > 配合快捷键 窗口管理


### Raycast 还提供了一些官方插件，例如：

#### Snippets
这个功能允许你在 Raycast 中创建自己的代码片段，并且支持 placeholder 和 keyword 触发。例如，我有一个 Snippets 内容是我的 SSH 公钥，keyword是 `!sshkey`，那么我只需要在 macOS 的任何地方输入 `!sshkey`，然后就会自动替换成我的 SSH 公钥。

![Snippets](@assets/images/posts/what-in-my-raycast/raycast-snippet.png)

#### Quicklinks
我主要使用快速链接作为我的浏览器书签。但它们甚至允许您使用搜索查询来打开与它们的链接。
例如，我有一个快速打开我的 Github star，那么我只需要在 Raycast 中输入 `star`，然后就可以直接跳转到我的 Github star 页面，不需要打开浏览器，然后打开 Github，在点开个人的 Profile，再点开 Star。很方便！

![Quicklinks](@assets/images/posts/what-in-my-raycast/raycast-quicklinks.png)



## Script Commands
Raycast 还支持使用，AppleScript，Bash，Python，JavaScript 等脚本语言来编写自己的脚本命令。以下是我自己编写的一些脚本命令：

- [Network Status](https://gist.github.com/RealTong/6291ee30dc93d59af52e30610845cdf0)
  > 用来查看网络状态，显示 SSID 名称，IP 地址、网关等网络信息
  > ![Network Status](@assets/images/posts/what-in-my-raycast/raycast-network-status.png)

- [Copy Captcha](https://gist.github.com/RealTong/13eb9eeb7a1f5a703f51083a4b15a358)
  > 用来复制 Mail 中的验证码
  > ![Copy Captcha](@assets/images/posts/what-in-my-raycast/raycast-copy-captcha-mail.png)


## Conclusion 
最后我提供一些我的 Raycast 快捷键配置：
| 快捷键 | 描述 |
| --- | --- |
| `⌘ + Space` | 呼出 Raycast |
| `⌥ + E` | 呼出 Emoji 搜索面板 |
| `⌥ + V` | 呼出剪贴板历史记录 |
| `⌥ + S` | 呼出 Snippets |
| `⌥ + B` | 搜索 Arc Bookmark |
| `⌥ + N` | 切换窗口 |
| `⌥ + F` | 搜索文件 |
| `⌥ + T` | 打开 [MultiTranslate](https://github.com/antfu/raycast-multi-translate) |
| `⌥ + A` | 打开 Raycast AI |


Raycast 社区还提供了很多 [脚本命令](https://github.com/raycast/script-commands/tree/master/commands#apps)、[Snippets](https://snippets.ray.so/symbols)、[Prompt](https://prompts.ray.so/code)、[Icon Maker](https://icon.ray.so/)、[Raycast Wallpapers](https://www.raycast.com/wallpapers)

现在就这样，下次再见！👋