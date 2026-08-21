import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useCreateDiseaseReport, useMyDiseaseReports } from '@/features/diseaseReports/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const schema = z.object({
  cropName: z.string().trim().min(1, 'Crop name is required').max(100),
  symptoms: z.string().trim().min(1, 'Describe what you are seeing').max(1000),
  image: z
    .custom()
    .refine((files) => files?.length === 1, 'A leaf photo is required')
    .transform((files) => files[0]),
})

const statusVariant = {
  pending: 'secondary',
  in_review: 'default',
  resolved: 'default',
}

export default function DiseaseReportsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: reports, isLoading } = useMyDiseaseReports()
  const createReport = useCreateDiseaseReport()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (values) => {
    createReport.mutate(values, {
      onSuccess: () => {
        reset()
        setShowForm(false)
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Disease Reports</h1>
          <p className="text-muted-foreground text-sm">Upload a leaf photo and an expert will review it.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'Report a problem'}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New report</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cropName">Crop</Label>
                <Input id="cropName" {...register('cropName')} />
                {errors.cropName && <p className="text-destructive text-sm">{errors.cropName.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea id="symptoms" rows={3} {...register('symptoms')} />
                {errors.symptoms && <p className="text-destructive text-sm">{errors.symptoms.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="image">Leaf photo</Label>
                <Input id="image" type="file" accept="image/*" {...register('image')} />
                {errors.image && <p className="text-destructive text-sm">{errors.image.message}</p>}
              </div>
              {createReport.isError && (
                <p className="text-destructive text-sm">Couldn't submit the report. Try again.</p>
              )}
              <Button type="submit" disabled={createReport.isPending}>
                {createReport.isPending ? 'Submitting…' : 'Submit for review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-muted-foreground text-sm">Loading reports…</p>}
      {reports && reports.length === 0 && <p className="text-muted-foreground text-sm">No reports yet.</p>}

      <div className="flex flex-col gap-3">
        {reports?.map((report) => (
          <Link key={report._id} to={`/disease-reports/${report._id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{report.cropName}</CardTitle>
                <Badge variant={statusVariant[report.status]}>{report.status.replace('_', ' ')}</Badge>
              </CardHeader>
              <CardContent className="text-muted-foreground line-clamp-2 text-sm">{report.symptoms}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
