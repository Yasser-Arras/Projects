import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog
} from "lucide-react";

export function getWeatherIcon(type) {
  switch (type) {
    case "Clear":
      return Sun;

    case "Clouds":
      return Cloud;

    case "Rain":
      return CloudRain;

    case "Drizzle":
      return CloudDrizzle;

    case "Thunderstorm":
      return CloudLightning;

    case "Snow":
      return CloudSnow;

    case "Mist":
    case "Fog":
    case "Haze":
      return CloudFog;

    default:
      return Sun;
  }
}