import { apiSlice } from '@/app/apiSlice'

export const weatherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentWeather: builder.query({
      query: ({ lat, lon }) => ({ url: '/weather/current', params: { lat, lon } }),
      transformResponse: (res) => res.data.weather,
    }),
    getForecast: builder.query({
      query: ({ lat, lon }) => ({ url: '/weather/forecast', params: { lat, lon } }),
      transformResponse: (res) => res.data.forecast,
    }),
  }),
})

export const { useGetCurrentWeatherQuery, useGetForecastQuery } = weatherApi
