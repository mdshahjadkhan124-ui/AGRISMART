import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from '@/features/admin/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Role } from '@/features/auth/types'

const roles: Role[] = ['farmer', 'expert', 'officer', 'seller', 'gov_admin', 'super_admin']

export default function AdminUsersPage() {
  const currentUserId = useAppSelector((state) => state.auth.user?.id)
  const [search, setSearch] = useState('')
  const { data: users, isLoading } = useAdminUsers({ search: search || undefined })
  const updateRole = useUpdateUserRole()
  const updateStatus = useUpdateUserStatus()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">User Management</h1>

      <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {isLoading && <p className="text-muted-foreground text-sm">Loading users…</p>}

      <div className="flex flex-col gap-3">
        {users?.map((user) => {
          const isSelf = user.id === currentUserId
          return (
            <Card key={user.id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">
                  {user.name} <span className="text-muted-foreground font-normal">· {user.email}</span>
                </CardTitle>
                <Badge variant={user.isActive ? 'default' : 'destructive'}>{user.isActive ? 'Active' : 'Deactivated'}</Badge>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Select
                  value={user.role}
                  disabled={isSelf || updateRole.isPending}
                  onValueChange={(role) => updateRole.mutate({ id: user.id, role })}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSelf || updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: user.id, isActive: !user.isActive })}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                {isSelf && <span className="text-muted-foreground text-xs">(you)</span>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
