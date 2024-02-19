import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://www.realtong.cn/", // replace this with your deployed domain
  author: "RealTong",
  desc: "RealTong's Blog",
  title: "RealTong's Blog",
  ogImage: "site-og.png",
  lightAndDarkMode: true,
  postPerPage: 5,
  scheduledPostMargin: 30 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/RealTong",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:i@realtong.cn",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "X",
    href: "https://twitter.com/RealTong_run",
    linkTitle: `${SITE.title} on X`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/realtong_run/",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/profiles/76561199000200043/",
    linkTitle: `${SITE.title} on Steam`,
    active: true,
  }
];
