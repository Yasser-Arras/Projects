import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx"; 
import ForecastRow from "./components/ForecastRow.jsx";
import Highlights from "./components/Highlights.jsx";
import OtherCities from "./components/OtherCities.jsx";
import SunCard from "./components/SunCard.jsx"; //5
import { getCityFromCoords, getWeather, getForecast } from "./utils/api.js";

export default function App() {
  const [city, setCity] = useState("Casablanca");
  const [coords, setCoords] = useState(null);
  const [unit, setUnit] = useState("C");

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const convertTemp = (tempC) => {
    return unit === "C" ? Math.round(tempC) : Math.round(tempC * 9/5 + 32);
  };

  // Geolocationi
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
          try {
            const userCity = await getCityFromCoords(
              position.coords.latitude,
              position.coords.longitude
            );
            setCity(userCity);
          } catch (err) {
            console.error(err);
          }
        },
        () => console.warn("Geolocation denied, defaulting to Casablanca")
      );
    }
  }, []);

  // Fetch weather and forecast when city changes
 useEffect(() => {
  if (!city) return;
  getWeather(city).then(setWeather).catch(console.error);
  getForecast(city).then(setForecast).catch(console.error);
}, [city]);

  return (
    <div className="h-screen flex bg-[#061311] text-white">

      {/* SIDEBAR */}
      <div className="w-[80px] bg-[#081512] flex flex-col items-center py-6 gap-6 border-r border-white/5">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 flex flex-col gap-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <SearchBar onSearch={setCity} />

          {/* UNIT TOGGLE */}
          <div className="flex bg-[#102925] rounded-full overflow-hidden">
            <button
              onClick={() => setUnit("C")}
              className={`px-3 py-1 ${unit === "C" ? "bg-green-600" : ""}`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit("F")}
              className={`px-3 py-1 ${unit === "F" ? "bg-green-600" : ""}`}
            >
              °F
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex gap-6 flex-1">

          {/* LEFT */}
          <div className="flex-[2] flex flex-col gap-6">

            {/* CURRENT WEATHER */}
            <div className="h-[260px] rounded-2xl p-6 bg-gradient-to-br from-[#13332d] to-[#0d221f] shadow-lg">
              <CurrentWeather weather={weather} city={city} unit={unit} convertTemp={convertTemp} />
            </div>

            <div className="flex gap-6">

              {/* FORECAST ROW */}
              <div className="flex-[2] rounded-2xl p-4 bg-gradient-to-br from-[#112e28] to-[#0b1f1c]">
               <ForecastRow
              forecast={forecast}
              unit={unit}
              convertTemp={convertTemp}
            />
              </div>

              {/* SUN CARD */}
              <div className="w-[200px] rounded-2xl p-4 bg-gradient-to-br from-[#112e28] to-[#0b1f1c]">
                <SunCard />
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex-1 flex flex-col gap-6">

            {/* HIGHLIGHTS */}
            <div className="rounded-2xl p-4 flex-1 bg-gradient-to-br from-[#112e28] to-[#0b1f1c]">
              <Highlights />
            </div>

            {/* OTHER CITIES */}
            <div className="rounded-2xl p-4 h-[180px] bg-gradient-to-br from-[#112e28] to-[#0b1f1c]">
              <OtherCities coords={coords} unit={unit} convertTemp={convertTemp} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}