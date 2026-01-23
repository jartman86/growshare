export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  windDirection: number
  pressure: number
  visibility: number
  clouds: number
  rain?: number
  snow?: number
  sunrise: number
  sunset: number
  timestamp: number
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
}

interface OpenWeatherResponse {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  visibility: number
  clouds: {
    all: number
  }
  rain?: {
    '1h'?: number
  }
  snow?: {
    '1h'?: number
  }
  sys: {
    sunrise: number
    sunset: number
    country: string
  }
  name: string
  coord: {
    lat: number
    lon: number
  }
  dt: number
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.WEATHER_API_KEY
  if (!apiKey) {
    console.error('WEATHER_API_KEY is not configured')
    return null
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(url, { next: { revalidate: 1800 } }) // Cache for 30 minutes

    if (!response.ok) {
      console.error('Weather API error:', response.statusText)
      return null
    }

    const data: OpenWeatherResponse = await response.json()

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
      windSpeed: Math.round(data.wind.speed),
      windDirection: data.wind.deg,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1609.34), // Convert meters to miles
      clouds: data.clouds.all,
      rain: data.rain?.['1h'],
      snow: data.snow?.['1h'],
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timestamp: data.dt,
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

export async function fetchWeatherByCity(city: string, state?: string, country: string = 'US'): Promise<WeatherData | null> {
  const apiKey = process.env.WEATHER_API_KEY
  if (!apiKey) {
    console.error('WEATHER_API_KEY is not configured')
    return null
  }

  try {
    const query = state ? `${city},${state},${country}` : `${city},${country}`
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=imperial`
    const response = await fetch(url, { next: { revalidate: 1800 } })

    if (!response.ok) {
      console.error('Weather API error:', response.statusText)
      return null
    }

    const data: OpenWeatherResponse = await response.json()

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
      windSpeed: Math.round(data.wind.speed),
      windDirection: data.wind.deg,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1609.34),
      clouds: data.clouds.all,
      rain: data.rain?.['1h'],
      snow: data.snow?.['1h'],
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timestamp: data.dt,
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
