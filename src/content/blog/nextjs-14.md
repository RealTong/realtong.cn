---
author: RealTong
pubDatetime: 2023-12-05T12:15:00Z
modDatetime: 2023-12-05T12:18:00Z
title: NextJS 14 新特性总结
slug: nextjs-14
featured: false
draft: true
tags:
  - DevOps
  - Free service
description:
    NextJS 14 新特性总结
---


## 开始
Next.js 14 推出了新的 App router ，Server component 和 Streaming 等新特性。

### App router
Vercel 推出了一个新的路由系统，用于替代原来 Page router，但 Page router 仍然可用。并且可以和 App router 混合使用。

![image](@assets/images/posts/nextjs-14/top-level-folders.avif)

App Router 的顶级路由是 app 目录，下级可创建自己的目录。每个目录下面创建 page.tsx 来定义页面内容。
#### Route Resolution
```typescript
export default function Page() {
    return <h1>Hello, Dashboard Page!</h1>
}
```

动态路由可以使用 [] 形式来定义，和 Page router 保持一致。例如
```typescript
// app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
    return <div>My Post: {params.slug}</div>
}
```

如果只是想通过文件夹组织代码，而不想体现到路由中，可以使用 [Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups#convention) 路由分组，用 () 形式定义目录名。

![Route Group](@assets/images/posts/nextjs-14/route-group-organisation.avif)

如果想用 NextJS 同时作为后端服务，可以使用 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 来定义 API 路由，使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) API。
```typescript
export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    return Response.json({
        "name":"RealTong"
    })
}
```

### 
路由的目录下不可能只有一个 page.tsx 文件，还可以添加 Layout.tsx 模板。

#### Layout
如果想多个page.tsx 共用一个布局，可以使用在需要复用的tsx上添加一个layout.tsx，默认到出一个RootLayout函数接收一个children类型的参数，顶级路由的 Layout 是必须的，用于定义 <html> 和 <body> 标签。其他下级路由可自定义 Layout ，可多级嵌套。
```typescript
// page/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```
路由目录下还可以定义 Template Loading Error Not-Found 等，功能非常强大。

Server Component
Next.js 默认所有的组件都是 Server Component 服务端组件，即服务端渲染 SSR 。它的好处主要有两点：安全和性能。

服务端处理数据会更加安全。服务端可缓存数据、直接渲染 HTML 、还可支持 Streaming 流式渲染，这些方式都会提升性能。

如果有些组件需要用到浏览器的 API ，则需要标记为客户端组件，使用 'use client'。例如 useEffect 就需要客户端组件，其他常见的还有 useState 、 DOM 事件、路由和 url 操作、表单校验等很多。当一个组件为客户端组件时，在其中引入的所有子组件都是客户端组件。
```typescript
'use client'

import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    console.log('done')
  }, [])

  return <p>About</p>
}
```
Server Component 是获取数据，并一次性渲染出结果（构建时，或者运行时），重点在于渲染。Client Component 是渲染完成以后，还有其他的交互和更新，重点在于交互。所以两者各有各的职责，要相互配合。

Streaming 流式渲染
当一个页面因为数据加载过慢时，会导致页面加载卡顿。
如果前端后端分离，自己开发前端，解决这个问题很简单，只需要加一个 loading 状态即可。

image.png

而在 Next.js 中也非常简单，只需要在路由目录加一个 loading.tsx ，Next.js 会自动实现 loading 状态。

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```
这种是简单粗暴的 loading 整个页面。如果页面模块较多，有可能有些模块加载快，有些模块加载慢，最好的方式是一部分一部分的加载 —— 这就是 Streaming 流式渲染。

image.png

Streaming 也不是新东西了，当年 facebook 在 PHP 时代就搞过这个，但后来没流行开来，说明通用性不强。
而 Next.js 结合 React 实现起来就非常简单，主要用到 <Suspense> 组件。Page 只是容器，具体的数据获取在各个子组件内部进行。
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'
 
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```
我录制了一个 gif 动图，可以看看效果：

Kapture 2024-01-16 at 15.11.50.gif

获取数据和缓存
Server Component 可以直接在一个 async 函数中请求数据，也可以在服务端 API 或者 Server Action 中获取数据。
```typescript
async function getData() {
  const res = await fetch('https://api.example.com/...')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>xxx</main>
}
```
但是，Next.js 默认情况下会缓存获取的数据，如不想缓存，需要增加 revalidate 机制，如按时间，或不缓存。

`fetch('https://...', { next: { revalidate: 3600 } })`

`fetch('https://...', { cache: 'no-store' })`
获取第三方数据时，可使用 noStore() 做标记。
```typescript
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  
  // get and return db data
}

// Next.js 还有非常复杂的 缓存机制，从服务端和客户端、从路由和数据。例如在创建页提交表单以后，回到列表页，需要重新验证页面缓存。

revalidatePath('/dashboard/invoices');
```
Server Action
用 'use server' 标记一个 ts 文件（里面的所有函数），或者一个 ts 函数，则可把他们标记为 Server Action 即在服务端执行的代码，一般用户客户端提交数据。【注意】'use server' 不是标记 React 组件的，而是针对函数的。

Server Component 中，可以直接定义一个 async 函数中为 Server Action ，也可以引入一个文件。

```typescript
// Server Component
export default function Page() {
  // Server Action
  async function create() {
    'use server'
    // ...
  }

  return (
    // ...
  )
}
```
而 Client Component 只能引入一个 Server Action 文件。或者把 create 函数作为属性，传递给客户端组件。

```typescript
// app/actions.ts
'use server'
export async function create() {
  // ...
}

// app/ui/button.tsx
import { create } from '@/app/actions'
export function Button() {
  return (
    // ...
  )
}
```
Server Action 函数可用于 <form> 或者 DOM 事件、 useEffect 等任何地方，Next.js 为它做了很多工作，例如：

服务端组件，可在页面 JS 未加载完成的情况下，进行 form 提交
客户端组件，如页面 JS 未加载完成，form 提交会暂存一个队列，页面渲染完再自动执行提交
Server Action 中可使用 Next.js 数据缓存机制
背后统一使用 POST 请求来保证兼容性和安全性
Next.js 使用 Server Action 做到了进一步的 Hybration “水合”，即在开发体验上模糊前端和服务端的界限。你都不用单独开发服务端接口了，所有的都在一个一个 JS 方法中调用和传递。

这样做：第一，可以降低对研发人员的技术要求，只要懂 React 就能快速上手操作。第二，给 Next.js 极大的性能优化空间，一切都听它在背后指挥。

但这样做的坏处，是可能又会培养一批不懂 HTTP 协议的“Next 工程师”，类似一些不懂 JS 语法的“Vue 工程师”一样。

Server Action 是否重回 PHP 时代？
image.png

Next.js 14 发布 Server Action 遭到很多吐槽，又重新回到 PHP 时代。但我不这么认为。

具体可以看我上一篇博客 《Nestjs 助力 Offer : 论服务端技能对于前端人员的重要性》 里面有详细写我的观点。

