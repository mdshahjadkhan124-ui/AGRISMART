import { useAdminAuditLogs } from '@/features/admin/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminAuditLogsPage() {
  const { data: logs, isLoading } = useAdminAuditLogs()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>

      {isLoading && <p className="text-muted-foreground text-sm">Loading audit logs…</p>}
      {logs && logs.length === 0 && <p className="text-muted-foreground text-sm">No audit log entries yet.</p>}

      <div className="flex flex-col gap-2">
        {logs?.map((log) => {
          const actor = typeof log.actor === 'object' ? log.actor : null
          return (
            <Card key={log._id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">{log.action}</CardTitle>
                <span className="text-muted-foreground text-xs">{new Date(log.createdAt).toLocaleString()}</span>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                {actor && (
                  <p>
                    By {actor.name} ({actor.email})
                  </p>
                )}
                {Object.keys(log.metadata).length > 0 && (
                  <p className="mt-1 text-xs">{JSON.stringify(log.metadata)}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
