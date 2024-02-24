---
author: RealTong
pubDatetime: 2023-12-05T12:15:00Z
modDatetime: 2023-12-05T12:18:00Z
title: NextJS 14 新特性总结
slug: nextjs-14
featured: false
draft: false
tags:
  - DevOps
  - Free service
description:
    NextJS 14 新特性总结
summary:
    NextJS 新版本（14）推出了 App Router、Server Component 和 Streaming 等新特性。App router 提供新的路由系统，可以与原有的 Page router 混合使用，便于管理页面。Server component 提升了安全性和性能，支持缓存和流式渲染。Streaming 可以解决页面因请求延迟而卡顿的问题。Fetch & Cache 引入了复杂的缓存机制，可通过设置 revalidate 或 no-store 控制缓存。Server Action 允许在服务端执行代码，用于处理客户端提交的数据。
---

## Table of contents

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

NextJS 14 还有其他的一些文件约定，这里提供一个详细的表格

| 文件名 | 作用 |
| --- | --- |
|layout |	用于共享页面布局
|page |	定义页面内容
|loading |	定义页面 loading 状态
|not-found | 404 页面
|error |	定义页面错误
|global-error | 全局错误处理
|route |	定义 API 路由
|template |	专门的重新渲染的布局 UI
|default |	并行路由的 Fallback UI

### Server Component
NextJS 14 版本默认所有的组件都是 Server Component 服务端组件。服务端处理数据会更加安全。服务端可缓存数据、直接渲染 HTML 、还可支持 Streaming 流式渲染，这些方式都会提升性能。

如果有些组件需要用到浏览器的 API ，则需要开发人员手动标记为客户端组件，使用 'use client' 关键字。例如 useEffect 就需要客户端组件，其他常见的还有 useState 、 DOM 事件、路由和 url 操作、表单校验等很多。当一个组件为客户端组件时，在其中引入的所有子组件都必须是客户端组件。
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
关于 Server Component 和 Client Component 的区别，可以简单理解为：
- Server Component 是获取数据，并一次性渲染出结果（构建时，或者运行时），重点在于渲染。
- Client Component 是渲染完成以后，还有其他的交互和更新，重点在于交互。

#### Streaming 流式渲染
设想一个场景，一个 dashboard 页面，上面有很多模块，例如用户信息、订单信息、商品信息、天气信息等等。当其中的某个模块 API 请求过慢时，整个页面会因为等待而卡顿。造成用户体验不好。 这是就用到了 Streaming 流式渲染。

这在 NextJS 14 中变得容易也非常简单，只需要在路由文件夹中加一个 loading.tsx ，结合 Suspense 组件，就可以实现。

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

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

![loading-special-file](@assets/images/posts/nextjs-14/loading-special-file.avif)
![loading-overview](@assets/images/posts/nextjs-14/loading-overview.avif)

### Fetch & Cache
NextJS 14 引入了非常复杂的缓存机制，用于获取数据和缓存。并且 NextJS 默认情况下会缓存所有获取的数据。

如果使用 fetch 获取数据，可以使用 revalidate 或者 {cache: 'no-store'} 来设置缓存时间。
```typescript
fetch('https://...', { next: { revalidate: 3600 } })

fetch('https://...', { cache: 'no-store' })
```

还可以这样：使用 noStore() 做标记。
```typescript
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // 这相当于 fetch(..., {cache: 'no-store'}).
  noStore();
  
  // get and return db data
}

// 如果需要重新验证某个页面的缓存，还可以使用 revalidatePath。
revalidatePath('/dashboard/invoices');
```

### Server Action
用 'use server' 标记一个 ts 文件（里面的所有函数），或者一个 ts 函数，则可把他们标记为 Server Action 即在服务端执行的代码，一般用户客户端提交数据。

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
Server Action 函数可用于 `<form>` 或者 DOM 事件、 useEffect 等任何地方。