export interface Props {
  name: string;
  type: "Devices" | "Accessories" | "Apps" | "Services" | "HomeKit" | "Other";
  image: any;
}

export default function ToolCard({
    name,
    type,
    image,
}: Props) {
    return (
        <li className="flex flex-col items-center justify-between w-44 h-60 p-2 rounded-md" id="ToolCard">
            <img className="h-2/3 object-cover object-center" src={image} alt={name} />
            <div className="flex flex-col w-full max-h-1/3">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-sm text-gray-600">{type}</p>
            </div>
        </li>
    );
}
