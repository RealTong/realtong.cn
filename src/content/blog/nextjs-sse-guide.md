---
author: RealTong
pubDatetime: 2023-08-29T15:22:00+08:00
modDatetime: 2023-08-29T15:22:00+08:00
title: SSE 在 NextJS 中的使用指南
slug: nextjs-sse-guide
featured: false
draft: false
tags:
  - NextJS
  - Frontend
  - ChatGPT
  - SSE
description: SSE 在 NextJS 中的完整指南
---

## Table of contents

### 在阅读此文之前，你可能需要先了解这些知识

- [NextJS API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [Server Send Event 教程](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)

因为最近在公司着手开始一个类似 Perplexity 的 MVP，技术栈上选择了 NextJS 和 LangChain JS 。尝试了 NextJS 的 API Route 和 SSE 踩了很多坑。打算用此文记录一些实践。

## API Route 作为服务端发送事件

1. 首先按照 [NextJS API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes#http-methods) 创建一个 HTTP Method

   ```tsx
   // src/pages/api/ask.ts
   import type { NextApiRequest, NextApiResponse } from "next";

   export default async function handler(
     req: NextApiRequest,
     res: NextApiResponse<any>
   ) {}
   ```

2. 设置 API 的 `Content-Type` 为 `text/event-stream`

   ```tsx
   res.setHeader("Content-Type", "text/event-stream");
   res.setHeader("Cache-Control", "no-cache");
   res.setHeader("Connection", "keep-alive");
   ```

3. 使用 res.write 来发送事件消息

   ```tsx
   res.write(`data: this is event data\n\n`);
   ```

完整的代码是这样：

```tsx
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method == "POST") {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: this is event data\n\n`);
      res.end();
    } else {
      console.log("HTTP Method not allowed: " + req.method);
    }
  } catch (error: any) {
    console.log(error);
    res.status(200).json({
      code: 500,
      message: "请求出错，请稍后重试",
    });
  }
}
```

这样就向前端发送了一次 事件，如果要连续发送，就可以使用 setInterval() 方法或者根据业务来多次发送，只需要将数据使用 `res.write` 发送就可以。

## 在前端接收 SSE 事件

```tsx
async function* askAPI(chatId: string, question: string) {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream",
    },
    body: JSON.stringify({
      chatId,
      question,
    }),
  });
  if (response.ok) {
    // 读取流式数据
    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) {
      throw new Error("读取流式数据失败");
    }
    let lastChunk = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lastChunk += value;
      let eolIndex;

      while ((eolIndex = lastChunk.indexOf("\n\n")) >= 0) {
        const message = lastChunk.slice(0, eolIndex).trim();
        if (message.startsWith("data: ")) {
          yield message.slice(5);
        }
        lastChunk = lastChunk.slice(eolIndex + 2);
      }
    }
  } else {
    throw new Error("LLM 请求返回失败");
  }
}

async function handleAddMessage() {
  let finalChunk = "";
  for await (const chunk of askAPI(chatId, inputValue)) {
    let data: string | AskData = "";
    try {
      data = JSON.parse(chunk) as AskData;
      // update message state
    } catch (e) {
      data = chunk;
      finalChunk += data;
    }
  }
}
```
