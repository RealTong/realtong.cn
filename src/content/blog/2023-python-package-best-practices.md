---
author: RealTong
pubDatetime: 2023-09-09T15:22:00Z
modDatetime: 2023-09-09T15:22:00Z
title: 2023 年 Python 包最佳实践
slug: 2023-python-package-best-practices
featured: false
draft: false
tags:
  - Backend
  - Python
description:
    2023 年 Python 包最佳实践
summary:
    这篇博客介绍了三种流行的 Python 包管理工具：venv、Conda 和 Poetry。venv 简单易用但跨平台存在问题，Conda 内置功能繁多占用空间，而 Poetry 则是更好的选择。Poetry 简洁强大，统一了创建、管理和发布 Python 包的流程，自动记录依赖并锁定版本，避免磁盘空间浪费。推荐开发者尝试使用 Poetry，以获得更愉快、高效的开发体验。
---

## Table of contents

今年开始😀， 工作的一部分来和 LLM 打交道，自然少不了写 Python 了。

## 目前流行的 Python 的包管理方案

- venv
- Conda
- Poetry

### venv

venv 是 pip 自带的虚拟环境及包管理解决方案，开箱即用。

> Test
> 

使用 venv 通常需要

1. 创建环境：`python -m venv venv`
2. 激活环境：`source venv/bin/activate`
3. 安装依赖：`pip install flask`
4. 锁定依赖：`pip freeze > requirements.txt`
5. 退出环境：`deactivate`

这样看还挺好的是吧，但是其他在 macOS 和 Windows 上，激活环境的命令不一致，Windows 激活 venv *虚拟环境*的命令是 `.\venv\Scripts\activate` 。

venv 还有一个缺点，如果我们有多个项目，那么就会存在多个由 `venv` 创建的虚拟环境，会大大占用磁盘空间，我的 512G MBP 可抗不住这么造啊。

venv 还有一个缺点，当使用 pip 安装包是不会自动将包写入到`requirement.txt` 中，这就很蛋疼了，曾经因为这个问题，一直被甲方在群里 @ 点名要依赖。

### Conda

经常接触数据，模型的朋友对 Conda 一定不陌生。 

使用 Conda 通常需要以下几步：

1. 创建环境：`conda create --name condaenv python=3.11`
2. 激活环境：`conda active condaenv`
3. 安装依赖：`conda install flask`
4. 退出环境：`conda deactivate`

Anaconda 中内置了一个 Python 解释器，同时还内置了许多常用的数据科学软件包或工具。但 内置的东西也太多了 8 ，其中的大部分又用不到，这无异于让我的 MBP 磁盘雪上加霜。

### Poetry

终于要介绍 poetry 了。

经过前面几个工具的对比，发现他们都有一些缺点：

- 占用空间
- 操作复杂
- 不能记录依赖
- 不能锁定依赖版本

## 这些问题，poetry都能解决！

使用 poetry 

1. 创建环境：`poetry init`
2. 安装依赖：`poetry add flask`
3. 激活虚拟环境：`poetry shell`
4. 退出虚拟环境：`exit`

最后，由 GPT 4 来个总结：

在尝试各种 Python 包管理工具后，你可能发现 venv 在磁盘空间使用和跨平台使用上不够友好，conda 内置的组件又过于庞大而并非都需要用到。好在，我们有一个更好的选择：Poetry.

Poetry 简洁而强大，它统一了创建、管理和发布 Python 包的流程。Poetry 不仅可以帮你自动创建和管理虚拟环境，还能让你无需手动编辑 requirements.txt，因为它将自动记录并锁定你的项目依赖。同时，使用 Poetry 无需担心磁盘空间，因为它的虚拟环境存储着仅与特定项目相关的 Python 版本和包，而非大量的、可能并不使用的包。此外，Poetry 也提供了友好的 CLI，使得你的开发流程更为高效且便捷。

因此，对于寻找可靠且高效的 Python 包管理工具的 Python 开发者们，我强烈推荐 Poetry。但理想的工具取决于每个人的具体需求和习惯，我这里提供的评价仅供参考。
希望你在此基础上，能找到最适合你的 Python 包管理工具，让你的编码之旅更加愉快顺滑。如果你已经准备好迎接更优雅的包管理体验，那就尝试开始使用 Poetry 吧！