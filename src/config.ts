import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://www.realtong.com/", // replace this with your deployed domain
  author: "RealTong",
  desc: "RealTong's Blog",
  title: "RealTong's Blog",
  ogImage: "site-og.png",
  lightAndDarkMode: true,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
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
    href: "mailto:i@realtong.com",
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
    name: "Steam",
    href: "https://steamcommunity.com/profiles/76561199000200043/",
    linkTitle: `${SITE.title} on Steam`,
    active: true,
  }
];

export const UMAMI = {
  enable: true,
  baseURL: "https://umami.realtong.com",
  websiteID: "7eb45700-819a-4fc5-bfff-9025e988c1c2",
  username: import.meta.env.UMAMI_USERNAME,
  password: import.meta.env.UMAMI_PASSWORD,
}
