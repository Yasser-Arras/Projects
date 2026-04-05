import { Sun, Moon } from "lucide-react";
import { getWeatherIcon } from "../utils/weatherIcons";

export default function CurrentWeather({ weather, city, unit, convertTemp }) {
  if (!weather) return <div>Loading current weather...</div>;

  const Icon = getWeatherIcon(weather.weather[0].main);

  const temp = convertTemp(weather.main.temp);
  const feelsLike = convertTemp(weather.main.feels_like);

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="h-full flex justify-between p-6 rounded-2xl bg-gradient-to-br from-[#13332d] to-[#0d221f]">
      {/* LEFT */}
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-sm opacity-60">{date}</p>
          <p className="text-sm opacity-60">Weather</p>
          <h1 className="text-6xl font-bold mt-2">{temp}°{unit}</h1>
          <p className="opacity-60">Feels like {feelsLike}°{unit}</p>
        </div>
        <div className="text-sm opacity-60">{city}</div>
      </div>

      {/* RIGHT ICON */}
      <div className="flex items-center">
        <Icon size={80} className="text-yellow-400" />
      </div>
    </div>
  );
}