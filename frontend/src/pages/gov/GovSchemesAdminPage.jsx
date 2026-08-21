import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateScheme, useDeleteScheme, useSchemes } from '@/features/schemes/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const categories = ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other']

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(2000),
  category: z.enum(categories),
  eligibility: z.string().trim().max(1000).optional(),
  state: z.string().trim().max(100).optional(),
  applicationLink: z.string().trim().max(500).optional(),
})

export default function GovSchemesAdminPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: schemes, isLoading } = useSchemes({ includeInactive: true })
  const createScheme = useCreateScheme()
  const deleteScheme = useDeleteScheme()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { category: 'other' } })

  const onSubmit = (values) => {
    createScheme.mutate(values, {
      onSuccess: () => {
        reset()
        setShowForm(false)
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Schemes</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'Publish scheme'}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} {...register('description')} />
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Category</Label>
                  <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="All India" {...register('state')} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="eligibility">Eligibility</Label>
                <Textarea id="eligibility" rows={2} {...register('eligibility')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="applicationLink">Application link</Label>
                <Input id="applicationLink" placeholder="https://…" {...register('applicationLink')} />
              </div>
              {createScheme.isError && <p className="text-destructive text-sm">Couldn't publish the scheme. Try again.</p>}
              <Button type="submit" disabled={createScheme.isPending}>
                {createScheme.isPending ? 'Publishing…' : 'Publish'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-muted-foreground text-sm">Loading schemes…</p>}

      <div className="flex flex-col gap-3">
        {schemes?.map((scheme) => (
          <Card key={scheme._id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">{scheme.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={scheme.isActive ? 'default' : 'secondary'}>{scheme.isActive ? 'Active' : 'Inactive'}</Badge>
                <Button variant="ghost" size="sm" onClick={() => deleteScheme.mutate(scheme._id)} disabled={deleteScheme.isPending}>
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground line-clamp-2 text-sm">{scheme.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
