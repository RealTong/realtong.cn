import { Props } from "../components/ToolCard";
import macbookpro from "../assets/images/tools/macbookpro.png";
import thunderobot911 from "../assets/images/tools/thunderobot-911.png";
import ktc from "../assets/images/tools/ktc.png";
import ipadpro11 from "../assets/images/tools/ipad_pro_11_3rd.png";
import iphone15pro from "../assets/images/tools/iPhone15Pro.png";
import pixel4xl from "../assets/images/tools/pixel4xl.png";
import applewatchs9 from "../assets/images/tools/AppleWatchS9.png";
import appletv7 from "../assets/images/tools/appletv7.png";
import mxmaster3s from "../assets/images/tools/mx-master-3s.webp";
import mxkeys from "../assets/images/tools/mx-keys.webp";
import magictrackpad from "../assets/images/tools/magic-trackpad.png";
import airpods2 from "../assets/images/tools/airpods2.png";
import airpodspro2typec from "../assets/images/tools/AirPodsPro2-Type-C.png";
import chromecast from "../assets/images/tools/chromecast.png";
import mijiascreenbar from "../assets/images/tools/mijia-screenbar.png";
import canysign4typec from "../assets/images/tools/canysign-4-typec.png";
import yubikey5cnfc from "../assets/images/tools/yubikey5c.png";
import yubikey5nfc from "../assets/images/tools/yubikey5.png";
import jetbrains from "../assets/images/tools/jetbrains.png";
import githubcopilot from "../assets/images/tools/Github-Copilot.png";
import chatgptplus from "../assets/images/tools/chatgpt-plus.png";
import buick from "../assets/images/tools/buick.png";

const tools: Props[] = [
  {
    name: 'MacBook Pro 14" 2021',
    type: "Devices",
    image: macbookpro.src,
  },
  {
    name: "THUNDEROBOT 911",
    type: "Devices",
    image: thunderobot911.src,
  },
  {
    name: "KTC H34S18",
    type: "Devices",
    image: ktc.src,
  },
  {
    name: 'iPad Pro 11" 2021',
    type: "Devices",
    image: ipadpro11.src,
  },
  {
    name: "Apple iPhone 15 Pro",
    type: "Devices",
    image: iphone15pro.src,
  },
  {
    name: "Google Pixel 4 XL",
    type: "Devices",
    image: pixel4xl.src,
  },
  {
    name: "Apple Watch S 9",
    type: "Devices",
    image: applewatchs9.src,
  },
  {
    name: "Apple TV 4K 2022",
    type: "Devices",
    image: appletv7.src,
  },
  {
    name: "Logitech Master 3s",
    type: "Accessories",
    image: mxmaster3s.src,
  },
  {
    name: "Logitech MX Keys",
    type: "Accessories",
    image: mxkeys.src,
  },
  {
    name: "Magic Trackpad",
    type: "Accessories",
    image: magictrackpad.src,
  },
  {
    name: "AirPods 2",
    type: "Accessories",
    image: airpods2.src,
  },
  {
    name: "AirPodsPro 2 Type-C",
    type: "Accessories",
    image: airpodspro2typec.src,
  },
  {
    name: "Chrome Cast with Google TV",
    type: "Devices",
    image: chromecast.src,
  },
  {
    name: "MiJia ScreenBar",
    type: "Accessories",
    image: mijiascreenbar.src,
  },
  {
    name: "硬糖120W小电拼",
    type: "Accessories",
    image: canysign4typec.src,
  },
  {
    name: "Yubikey 5C NFC",
    type: "Accessories",
    image: yubikey5cnfc.src,
  },
  {
    name: "Yubikey 5 NFC",
    type: "Accessories",
    image: yubikey5nfc.src,
  },
  {
    name: "Jetbrains All Products",
    type: "Services",
    image: jetbrains.src,
  },
  {
    name: "Github Copilot",
    type: "Services",
    image: githubcopilot.src,
  },
  {
    name: "ChatGPT Plus",
    type: "Services",
    image: chatgptplus.src,
  },
  {
    name: "Buick Verano Pro",
    type: "Devices",
    image: buick.src,
  },
];

const getAllTools = () => {
  return tools;
};

export default getAllTools;
