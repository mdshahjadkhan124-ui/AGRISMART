import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDiseaseQueue, useRespondToDiseaseReport } from '@/features/diseaseReports/hooks'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ReportFarmer } from '@/features/diseaseReports/types'

const respondSchema = z.object({
  diagnosis: z.string().trim().min(1, 'Diagnosis is required').max(1000),
  treatment: z.string().trim().min(1, 'Treatment advice is required').max(1000),
})

type RespondValues = z.infer<typeof respondSchema>

function RespondForm({ reportId, onDone }: { reportId: string; onDone: () => void }) {
  const respond = useRespondToDiseaseReport()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RespondValues>({ resolver: zodResolver(respondSchema) })

  const onSubmit = (values: RespondValues) => {
    respond.mutate({ id: reportId, input: values }, { onSuccess: onDone })
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`diagnosis-${reportId}`}>Diagnosis</Label>
        <Textarea id={`diagnosis-${reportId}`} rows={2} {...register('diagnosis')} />
        {errors.diagnosis && <p className="text-destructive text-sm">{errors.diagnosis.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`treatment-${reportId}`}>Treatment</Label>
        <Textarea id={`treatment-${reportId}`} rows={2} {...register('treatment')} />
        {errors.treatment && <p className="text-destructive text-sm">{errors.treatment.message}</p>}
      </div>
      {respond.isError && <p className="text-destructive text-sm">Couldn't submit the response. Try again.</p>}
      <Button type="submit" size="sm" disabled={respond.isPending}>
        {respond.isPending ? 'Submitting…' : 'Submit response'}
      </Button>
    </form>
  )
}

export default function DiseaseQueuePage() {
  const { data: reports, isLoading } = useDiseaseQueue()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Disease Report Queue</h1>
        <p className="text-muted-foreground text-sm">Reports waiting for expert review, oldest first.</p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading queue…</p>}
      {reports && reports.length === 0 && <p className="text-muted-foreground text-sm">The queue is empty.</p>}

      <div className="flex flex-col gap-4">
        {reports?.map((report) => {
          const farmer = report.farmer as ReportFarmer
          return (
            <Card key={report._id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">
                  {report.cropName}{' '}
                  <span className="text-muted-foreground font-normal">
                    · reported by {typeof farmer === 'object' ? farmer.name : 'a farmer'}
                  </span>
                </CardTitle>
                <Badge variant="secondary">{report.status.replace('_', ' ')}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <img src={report.imageUrl} alt={`${report.cropName} leaf`} className="max-h-72 w-full rounded-lg object-cover" />
                <p className="text-sm">{report.symptoms}</p>
                {openId === report._id ? (
                  <RespondForm reportId={report._id} onDone={() => setOpenId(null)} />
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setOpenId(report._id)}>
                    Respond
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
