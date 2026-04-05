import { Home, MapPin, Cloud, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex flex-col items-center gap-6 text-gray-400">
      <Home />
      <MapPin />
      <Cloud />
      <Settings />
    </div>
  );
}