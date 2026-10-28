// Acceso a la API de Open-Meteo (gratuita, no requiere clave).
// Docs: https://open-meteo.com/en/docs

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 8000;

// Error con un mensaje listo para mostrarse al usuario.
class ApiError extends Error {
  constructor(userMessage, kind) {
    super(userMessage);
    this.kind = kind; // "offline" | "timeout" | "rate-limit" | "server" | "empty" | "unknown"
  }
}

// Hace la petición y convierte cualquier falla en un ApiError.
async function fetchJSON(url) {
  if (!navigator.onLine) {
    throw new ApiError("No hay conexión a internet. Revisa tu red e inténtalo de nuevo.", "offline");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError("El servidor tardó demasiado en responder. Inténtalo de nuevo.", "timeout");
    }
    // fetch solo lanza excepción si la petición no llegó al servidor (red caída, DNS, CORS).
    throw new ApiError("No se pudo conectar con el servicio del clima. Revisa tu conexión.", "offline");
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) {
    throw new ApiError("Se alcanzó el límite de peticiones. Espera un minuto antes de volver a buscar.", "rate-limit");
  }
  if (response.status >= 500) {
    throw new ApiError("El servicio del clima no está disponible en este momento.", "server");
  }
  if (!response.ok) {
    throw new ApiError(`La petición falló (código ${response.status}).`, "unknown");
  }

  return response.json();
}

// Busca una ciudad por nombre y devuelve la primera coincidencia.
async function findCity(name) {
  const params = new URLSearchParams({ name, count: 1, language: "es", format: "json" });
  const data = await fetchJSON(`${GEOCODING_URL}?${params}`);

  // Si no hay coincidencias, la API responde sin el campo "results".
  if (!data.results || data.results.length === 0) {
    throw new ApiError(`No se encontró ninguna ciudad llamada "${name}".`, "empty");
  }

  const city = data.results[0];
  return {
    name: city.name,
    region: city.admin1,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
  };
}

// Obtiene el clima actual y el pronóstico diario de unas coordenadas.
async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: 6,
    timezone: "auto",
  });
  const data = await fetchJSON(`${FORECAST_URL}?${params}`);

  if (!data.current || !data.daily || !data.daily.time?.length) {
    throw new ApiError("La API respondió sin datos de clima para esta ubicación.", "empty");
  }
  return data;
}
