export interface CurrentWeather {
  temperatureC: number
  feelsLikeC: number
  humidityPercent: number
  windSpeedMs: number
  condition: string
  conditionIcon: string
  locationName: string
}

export interface ForecastDay {
  date: string
  minTempC: number
  maxTempC: number
  condition: string
}

export interface Forecast {
  locationName: string
  days: ForecastDay[]
}
