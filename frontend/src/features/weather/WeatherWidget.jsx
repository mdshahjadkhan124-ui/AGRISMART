import { useCurrentWeather, useForecast } from './hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WeatherWidget({ lat, lon }) {
  const current = useCurrentWeather(lat, lon)
  const forecast = useForecast(lat, lon)

  if (lat == null || lon == null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weather</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Add coordinates to this farm's location to see local weather.
        </CardContent>
      </Card>
    )
  }

  if (current.notConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weather</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Weather isn't configured yet — an OpenWeather API key needs to be added to the backend.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weather{current.data ? ` — ${current.data.locationName}` : ''}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {current.isLoading && <p className="text-muted-foreground text-sm">Loading current weather…</p>}
        {current.isError && !current.notConfigured && (
          <p className="text-destructive text-sm">Couldn't load weather right now.</p>
        )}
        {current.data && (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{Math.round(current.data.temperatureC)}°C</span>
            <span className="text-muted-foreground text-sm capitalize">{current.data.condition}</span>
          </div>
        )}
        {current.data && (
          <dl className="text-muted-foreground grid grid-cols-3 gap-2 text-xs">
            <div>
              <dt>Feels like</dt>
              <dd className="text-foreground">{Math.round(current.data.feelsLikeC)}°C</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd className="text-foreground">{current.data.humidityPercent}%</dd>
            </div>
            <div>
              <dt>Wind</dt>
              <dd className="text-foreground">{current.data.windSpeedMs} m/s</dd>
            </div>
          </dl>
        )}

        {forecast.data && forecast.data.days.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t pt-3">
            <p className="text-muted-foreground text-xs font-medium">5-day forecast</p>
            <div className="flex flex-wrap gap-3">
              {forecast.data.days.map((day) => (
                <div key={day.date} className="text-xs">
                  <p className="text-muted-foreground">{day.date.slice(5)}</p>
                  <p className="font-medium">
                    {Math.round(day.minTempC)}–{Math.round(day.maxTempC)}°C
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
