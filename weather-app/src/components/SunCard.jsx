import { Sunrise, Sunset } from "lucide-react";

export default function SunCard() {
  return (
    <div className="flex flex-col h-full mb-6">
      {/* Title */}
      <h2 className="opacity-70 ">Sun</h2>

      {/* Sunrise */}
      <div className="flex flex-col items-center justify-center gap-2 mb-6 text-orange-400">
        <Sunrise size={32} />
        <span className="text-white text-base font-medium">06:20 AM</span>
      </div>

      {/* Sunset */}
      <div className="flex flex-col items-center justify-center gap-2 text-red-400">
        <Sunset size={32} />
        <span className="text-white text-base font-medium">07:45 PM</span>
      </div>
    </div>
  );
}