'use client'

import { useState } from 'react'
import { Cloud, Droplets, Wind, Thermometer, Sun, Loader2, MapPin, X } from 'lucide-react'
import type { WeatherData } from '@/lib/weather'

interface WeatherWidgetProps {
  weatherData: WeatherData | null
  onCapture?: (data: WeatherData) => void
  onClear?: () => void
  isCompact?: boolean
}

export function WeatherWidget({ weatherData, onCapture, onClear, isCompact = false }: WeatherWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const captureWeather = async () => {
    if (!onCapture) return

    setIsLoading(true)
    setError(null)

    try {
      // Try to get user's location
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          })
        })

        const { latitude, longitude } = position.coords
        const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data = await response.json()
        onCapture(data)
      } else {
        setError('Geolocation is not supported by your browser')
      }
    } catch (err) {
      console.error('Error capturing weather:', err)
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access.')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Please try again.')
            break
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.')
            break
          default:
            setError('Failed to get your location')
        }
      } else {
        setError('Failed to fetch weather data')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Display weather data if we have it
  if (weatherData) {
    if (isCompact) {
      return (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt={weatherData.description}
            className="w-10 h-10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {weatherData.temperature}°F
              </span>
              <span className="text-sm text-gray-600 capitalize truncate">
                {weatherData.description}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{weatherData.location.name}</span>
            </div>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              alt={weatherData.description}
              className="w-16 h-16"
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {weatherData.temperature}°F
                </span>
                <span className="text-sm text-gray-600">
                  Feels like {weatherData.feelsLike}°F
                </span>
              </div>
              <p className="text-gray-700 capitalize">{weatherData.description}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{weatherData.location.name}, {weatherData.location.country}</span>
              </div>
            </div>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:bg-blue-200 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="font-medium text-gray-900">{weatherData.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Wind</p>
              <p className="font-medium text-gray-900">{weatherData.windSpeed} mph</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Clouds</p>
              <p className="font-medium text-gray-900">{weatherData.clouds}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Visibility</p>
              <p className="font-medium text-gray-900">{weatherData.visibility} mi</p>
            </div>
          </div>
        </div>

        {(weatherData.rain || weatherData.snow) && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            {weatherData.rain && (
              <p className="text-sm text-blue-700">Rain (last hour): {weatherData.rain} mm</p>
            )}
            {weatherData.snow && (
              <p className="text-sm text-blue-700">Snow (last hour): {weatherData.snow} mm</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Capture button when no weather data
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={captureWeather}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Cloud className="h-5 w-5" />
        )}
        {isLoading ? 'Fetching weather...' : 'Capture Current Weather'}
      </button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
