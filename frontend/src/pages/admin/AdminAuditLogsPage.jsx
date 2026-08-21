import { Loader2 } from 'lucide-react'
import { useAdminAuditLogs } from '@/features/admin/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminAuditLogsPage() {
  const { data: logs, isLoading, isError } = useAdminAuditLogs()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>

      {isLoading && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading audit logs…
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-destructive text-sm">Couldn't load audit logs. Try refreshing the page.</p>
      )}

      {!isLoading && !isError && (!logs || logs.length === 0) && (
        <p className="text-muted-foreground text-sm">No audit log entries yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {logs?.map((log) => {
          const actor = typeof log.actor === 'object' && log.actor !== null ? log.actor : null
          // metadata can be missing entirely on entries written before the
          // backend's minimize:false fix — never assume it's an object.
          const metadata = log.metadata ?? {}
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
                {Object.keys(metadata).length > 0 && <p className="mt-1 text-xs">{JSON.stringify(metadata)}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
