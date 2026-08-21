import { useParams } from 'react-router-dom'
import { useMyDiseaseReport } from '@/features/diseaseReports/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant = {
  pending: 'secondary',
  in_review: 'default',
  resolved: 'default',
}

export default function DiseaseReportDetailPage() {
  const { id } = useParams()
  const { data: report, isLoading } = useMyDiseaseReport(id)

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading report…</p>
  if (!report) return <p className="text-muted-foreground p-8 text-sm">Report not found.</p>

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">{report.cropName}</h1>
        <Badge variant={statusVariant[report.status]}>{report.status.replace('_', ' ')}</Badge>
      </div>

      <img src={report.imageUrl} alt={`${report.cropName} leaf`} className="max-h-96 w-full rounded-lg object-cover" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Symptoms reported</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{report.symptoms}</CardContent>
      </Card>

      {report.status === 'resolved' ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expert response</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div>
              <p className="font-medium">Diagnosis</p>
              <p className="text-muted-foreground">{report.diagnosis}</p>
            </div>
            <div>
              <p className="font-medium">Treatment</p>
              <p className="text-muted-foreground">{report.treatment}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground text-sm">Waiting for an expert to review this report.</p>
      )}
    </div>
  )
}
