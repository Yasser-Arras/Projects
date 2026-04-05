export const API_KEY = "key here";

export async function getWeather(city = "Casablanca") {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export async function getForecast(city = "Casablanca") {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}
export async function getCityFromCoords(lat, lon) {
  const API_KEY = "1c8c70df3b221ed4d50efaf9e7bfad21";
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to get city from coordinates");
  const data = await res.json();
  return data[0]?.name || "Casablanca";
}
// utils/api.js
export async function getNearbyCities(lat, lon, cnt = 5) {
  const API_KEY = "1c8c70df3b221ed4d50efaf9e7bfad21";
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${cnt}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch nearby cities");
  const data = await res.json();
  return data.list; 
}
