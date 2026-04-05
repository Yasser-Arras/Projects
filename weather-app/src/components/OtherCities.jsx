import { useEffect, useState } from "react";
import { getNearbyCities } from "../utils/api.js";
import { getWeatherIcon } from "../utils/weatherIcons";

export default function OtherCities({ coords, unit, convertTemp }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!coords) return;
    getNearbyCities(coords.lat, coords.lon)
      .then(setCities)
      .catch(console.error);
  }, [coords]);

  if (!cities.length) return <div>Loading nearby cities...</div>;

  return (
    <div className="flex flex-col h-full">
      <h3 className="opacity-70 mb-2">Nearby Cities</h3>
      <div className="flex-1 overflow-y-auto space-y-2">
        {cities.map((city) => {
          const Icon = getWeatherIcon(city.weather[0].main);
          return (
            <div
              key={city.id}
              className="flex justify-between items-center bg-[#0d221f] p-3 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                <span>{city.name}</span>
              </div>
              <span>{convertTemp(city.main.temp)}°{unit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}