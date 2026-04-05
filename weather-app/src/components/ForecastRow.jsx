export default function ForecastRow({ forecast = [], unit = "C", convertTemp }) {
  if (!forecast.length) return <div>Loading forecast...</div>;

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex gap-4 px-6 min-w-max">
        {forecast.map((f) => (
          <div
            key={f.dt}
            className="bg-[#0d211f] p-7 rounded-xl flex flex-col items-center justify-center gap-2 min-w-[100px] h-48"
          >
            <p className="text-white font-medium">
              {new Date(f.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
              alt={f.weather[0].description}
              className="w-10 h-10"
            />
            <p className="text-white font-semibold">
              {convertTemp(f.main.temp)}°{unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}