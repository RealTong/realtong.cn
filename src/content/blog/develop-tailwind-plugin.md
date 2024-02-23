---
author: RealTong
pubDatetime: 2023-04-14T15:22:00Z
modDatetime: 2023-04-14T15:22:00Z
title: 为 TailwindCSS 开发显示屏幕尺寸插件
slug: develop-tailwind-plugin
featured: false
draft: false
tags:
  - Web
  - Tailwind
  - Frond-end
description:
    为 TailwindCSS 开发显示屏幕尺寸插件
---
## Table of contents

## 成品展示
> 注意查看右下角的圆点！

![Demo](@assets/images/posts/develop-tailwind-plugin/demo.gif)

## 开发背景

Tailwind可以方便的用来构建响应式的用户界面, 同时提供了5种常见的分辨率

| prefix  | min-width | CSS |
| --- | --- | --- |
| sm | 640px | @media (min-width: 640px) |
| md | 768px | @media (min-width: 768px) |
| lg | 1024px | @media (min-width: 1024px) |
| xl | 1280px | @media (min-width: 1280px) |
| 2xl | 1536px | @media (min-width: 1536px) |

> 这是TailwindCSS官方提供的预置CSS, 也可自己定义
> 

开发响应式应用的时候需要不断调整浏览器的大小, 以便查看不同分辨率下的效果. 同时根据不同的分辨率调整对应的CSS, 但是只能打开F12, 观察Chrome显示的尺寸大小, 不够方便, 所以开发了这个TailwindCSS插件, 可以在浏览器上使用显示当前屏幕的prefix.

## 开发思路

Tailwind允许插件使用 `JavaScript` 而不是CSS来扩展它的功能.在 `TailwindCSS` 的配置文件中添加插件 `TailwindCSS plugin` 接收一个对象, 包含多个函数, 可以在插件内部解构出来使用.

| 参数 | 作用 |
| --- | --- |
| addUtilities() | 用于注册新的静态实用程序样式 |
| matchUtilities() | 用于注册新的动态实用程序样式 |
| addComponents() | 用于注册新的静态组件样式 |
| matchComponents() | 用于注册新的动态组件样式 |
| addBase() | 添加基础样式 |
| addVariant() | 用于注册自定义静态变体 |
| matchVariant() | 用于注册自定义动态变体 |
| theme() | 获得用户的theme配置 |
| config() | 获得用户的config |
| corePlugins() | 用于检查是否启用了核心插件 |
| e() | 用于手动转义要在类名中使用的字符串 |

- 我们需要向dom中添加一个block元素, 用于显示当前屏幕的prefix, 但Tailwind并没有提供操作dom的能力, 但提供的addComponents可以向dom添加样式, 转换思路, 使用CSS伪类选择器`::before`, 所以需要使用Tailwind提供的addComponents方法.
- 同时如前文所说Tailwind是允许用自定义屏幕尺寸break points, 所以我们需要获取用户的theme配置, 以便获取用户自定义的break points.

```jsx
// index.js

// 获取用户theme配置
const userTheme = theme('screens')

// 定义生效的CSS class 在元素中添加debug类样式
const selector = theme('debugScreens.selector', '.debug')

// 定义components
const components = {
    [`${selector}::before`]: Object.assign(
        {
            // 样式需要使用小驼峰命名, 值可以是tailwind预置的, 也可以使用原始CSS的写法
            position: 'fixed',
            zIndex: '50',
            width: 6,
            height: 6,
            borderRadius: '50%',
            bottom: '12px',
            right: '12px',
            padding: 12,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            content: `'xs'`,
        }
    ),
}

// 遍历用户配置的break points
Object.entries(screens)
    .forEach(([screen]) => {
        components[`@screen ${screen}`] = {
            [`${selector}::before`]: {
                content: `'${screen}'`,
            },
        }
    })
// 注册components
addComponents(components)
```

## 使用插件

```jsx
// tailwind.config.js

module.exports = {
    theme: {
        screens: {
            xs: '320px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
    },
    variants: {},
    plugins: [
        require('./index.js'),
    ],
}
```

```html
<!-- 建议添加到body上 -->
<div class="debug">
</div>
```

这样就可以在dom元素的右下角显示当前屏幕的prefix了.

设置仅在开发环境下显示: 

```html
<!-- es6模板字符串-->

<div class=`${process.env.NODE_ENV==='production' ? '' :'debug'}`>
</div>
```

## 开源地址

[https://gist.github.com/RealTong/d1dad966e7d8d1ee86011e3272f32b72](https://gist.github.com/RealTong/d1dad966e7d8d1ee86011e3272f32b72)