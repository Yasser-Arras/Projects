import { Sun, Wind, Droplets, Eye } from "lucide-react";

export default function Highlights() {
  const items = [
    { title: "UV Index", value: "5", icon: Sun },
    { title: "Wind", value: "3 km/h", icon: Wind },
    { title: "Humidity", value: "45%", icon: Droplets },
    { title: "Visibility", value: "8 km", icon: Eye },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <h2 className="opacity-70">Today's Highlights</h2>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={i} className="bg-[#0d221f] p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm opacity-60">{item.title}</p>
                <h3 className="text-xl font-bold">{item.value}</h3>
              </div>

              <Icon className="opacity-70" />
            </div>
          );
        })}
      </div>
    </div>
  );
}