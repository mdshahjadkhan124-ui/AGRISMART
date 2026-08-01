import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteFarm, useFarm } from '@/features/farms/hooks'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WeatherWidget from '@/features/weather/WeatherWidget'
import SoilReportsTab from './SoilReportsTab'
import CropHistoryTab from './CropHistoryTab'
import ActivitiesTab from './ActivitiesTab'

export default function FarmDetailPage() {
  const { farmId } = useParams<{ farmId: string }>()
  const navigate = useNavigate()
  const { data: farm, isLoading } = useFarm(farmId as string)
  const deleteFarm = useDeleteFarm()

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading farm…</p>
  if (!farm) return <p className="text-muted-foreground p-8 text-sm">Farm not found.</p>

  const handleDelete = () => {
    if (!confirm(`Delete "${farm.name}"? This removes all its soil reports, crop history, and activities.`)) return
    deleteFarm.mutate(farm._id, { onSuccess: () => navigate('/farms') })
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{farm.name}</h1>
          <p className="text-muted-foreground text-sm">
            {farm.areaAcres} acres · {farm.soilType} soil · {farm.irrigationType} irrigation
          </p>
        </div>
        <Button variant="outline" onClick={handleDelete} disabled={deleteFarm.isPending}>
          Delete farm
        </Button>
      </div>

      <WeatherWidget lat={farm.location?.lat} lon={farm.location?.lng} />

      <Tabs defaultValue="soil">
        <TabsList>
          <TabsTrigger value="soil">Soil health</TabsTrigger>
          <TabsTrigger value="crops">Crop history</TabsTrigger>
          <TabsTrigger value="activities">Activity diary</TabsTrigger>
        </TabsList>
        <TabsContent value="soil">
          <SoilReportsTab farmId={farm._id} />
        </TabsContent>
        <TabsContent value="crops">
          <CropHistoryTab farmId={farm._id} />
        </TabsContent>
        <TabsContent value="activities">
          <ActivitiesTab farmId={farm._id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
