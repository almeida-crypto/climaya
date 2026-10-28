// Lógica de la interfaz: lee el formulario, llama a la API y pinta los resultados.

// Códigos de clima WMO que usa Open-Meteo -> descripción e ícono.
const WEATHER_CODES = {
  0: ["Despejado", "☀️"],
  1: ["Mayormente despejado", "🌤️"],
  2: ["Parcialmente nublado", "⛅"],
  3: ["Nublado", "☁️"],
  45: ["Niebla", "🌫️"],
  48: ["Niebla con escarcha", "🌫️"],
  51: ["Llovizna ligera", "🌦️"],
  53: ["Llovizna", "🌦️"],
  55: ["Llovizna intensa", "🌧️"],
  61: ["Lluvia ligera", "🌦️"],
  63: ["Lluvia", "🌧️"],
  65: ["Lluvia intensa", "🌧️"],
  71: ["Nevada ligera", "🌨️"],
  73: ["Nevada", "🌨️"],
  75: ["Nevada intensa", "❄️"],
  80: ["Chubascos ligeros", "🌦️"],
  81: ["Chubascos", "🌧️"],
  82: ["Chubascos fuertes", "⛈️"],
  95: ["Tormenta", "⛈️"],
  96: ["Tormenta con granizo", "⛈️"],
  99: ["Tormenta fuerte con granizo", "⛈️"],
};

function describe(code) {
  return WEATHER_CODES[code] || ["Desconocido", "🌡️"];
}

const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const button = document.getElementById("search-btn");
const statusBox = document.getElementById("status");
const resultBox = document.getElementById("result");

function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status status--${type}`;
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.className = "status";
}

function renderWeather(city, weather) {
  const { current, daily } = weather;
  const [desc, icon] = describe(current.weather_code);

  const place = [city.name, city.region, city.country].filter(Boolean).join(", ");
  document.getElementById("place-name").textContent = place;
  document.getElementById("current-icon").textContent = icon;
  document.getElementById("current-desc").textContent = desc;
  document.getElementById("current-temp").textContent = `${Math.round(current.temperature_2m)}°C`;
  document.getElementById("feels-like").textContent = `${Math.round(current.apparent_temperature)}°C`;
  document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
  document.getElementById("wind").textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  // El índice 0 es hoy; mostramos los 5 días siguientes.
  const list = document.getElementById("forecast");
  list.innerHTML = "";
  for (let i = 1; i < daily.time.length; i++) {
    const [dayDesc, dayIcon] = describe(daily.weather_code[i]);
    // "T12:00" evita que la fecha se corra un día por la zona horaria.
    const date = new Date(`${daily.time[i]}T12:00`);
    const dayName = date.toLocaleDateString("es", { weekday: "short" });

    const li = document.createElement("li");
    li.title = dayDesc;
    li.innerHTML = `
      <div class="day">${dayName}</div>
      <div class="icon">${dayIcon}</div>
      <div class="range">${Math.round(daily.temperature_2m_max[i])}° <span class="min">${Math.round(daily.temperature_2m_min[i])}°</span></div>
    `;
    list.appendChild(li);
  }

  resultBox.hidden = false;
}

async function search(cityName) {
  button.disabled = true;
  showStatus("Buscando…", "info");

  try {
    const city = await findCity(cityName);
    const weather = await getWeather(city.latitude, city.longitude);
    renderWeather(city, weather);
    clearStatus();
  } catch (err) {
    resultBox.hidden = true;
    const message = err instanceof ApiError ? err.message : "Ocurrió un error inesperado. Inténtalo de nuevo.";
    showStatus(message, "error");
    console.error(err);
  } finally {
    button.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityName = input.value.trim();
  if (cityName.length < 2) {
    showStatus("Escribe al menos 2 letras del nombre de la ciudad.", "error");
    return;
  }
  search(cityName);
});

// Avisar al usuario si pierde o recupera la conexión mientras usa la app.
window.addEventListener("offline", () => showStatus("Perdiste la conexión a internet.", "error"));
window.addEventListener("online", () => showStatus("Conexión restablecida. Ya puedes buscar.", "info"));
