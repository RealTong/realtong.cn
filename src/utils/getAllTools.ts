import {Props} from "../components/ToolCard";


const tools: Props[] = [
  {
    name: 'MacBook Pro 14" 2021',
    type: "Devices",
    image: "macbookpro.png",
  },
  {
    name: "THUNDEROBOT 911",
    type: "Devices",
    image: "thunderobot-911.png",
  },
  {
    name: "KTC H34S18",
    type: "Devices",
    image: "ktc.png",
  },
  {
    name: 'iPad Pro 11" 2021',
    type: "Devices",
    image: "ipad_pro_11_3rd.png",
  },
  {
    name: "Apple iPhone 15 Pro",
    type: "Devices",
    image: "iPhone15Pro.png",
  },
  {
    name: "Google Pixel 4 XL",
    type: "Devices",
    image: "pixel4xl.png",
  },
  {
    name: "Apple Watch S 9",
    type: "Devices",
    image: "AppleWatchS9.png",
  },
  {
    name: "Apple TV 4K 2022",
    type: "Devices",
    image: "appletv7.png",
  },
  {
    name: "Logitech Master 3s",
    type: "Accessories",
    image: "mx-master-3s.webp",
  },
  {
    name: "Logitech MX Keys",
    type: "Accessories",
    image: "mx-keys.webp",
  },
  {
    name: "Magic Trackpad",
    type: "Accessories",
    image: "magic-trackpad.png",
  },
  {
    name: "AirPods 2",
    type: "Accessories",
    image: "airpods2.png",
  },
  {
    name: "AirPodsPro 2 Type-C",
    type: "Accessories",
    image: "AirPodsPro2-Type-C.png",
  },
  {
    name: "Chrome Cast with Google TV",
    type: "Devices",
    image: "chromecast.png",
  },
  {
    name: "MiJia ScreenBar",
    type: "Accessories",
    image: "mijia-screenbar.png",
  },
  {
    name: "Yubikey 5C NFC",
    type: "Accessories",
    image: "yubikey5c.png",
  },
  {
    name: "Yubikey 5 NFC",
    type: "Accessories",
    image: "yubikey5.png",
  },
  {
    name: "Jetbrains All Products",
    type: "Services",
    image: "jetbrains.png",
  },
];

const getAllTools = () => {
  return tools;
};

export default getAllTools;
