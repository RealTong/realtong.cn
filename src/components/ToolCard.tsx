import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  name: string;
  type: "Devices" | "Accessories" | "Apps" | "Services" | "HomeKit" | "Other";
  image: string;
}

export default function ToolCard({
    name,
    type,
    image,
}: Props) {

    return (
        <li className="flex flex-col items-center justify-between bg-gray-100 w-44 h-60 p-2 rounded-md">
            <img className="h-2/3 object-cover object-center" src={`/src/assets/images/tools/${image}`} alt={name} />
            <div className="flex flex-col w-full max-h-1/3">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-sm text-gray-600">{type}</p>
            </div>
        </li>
    );
}
