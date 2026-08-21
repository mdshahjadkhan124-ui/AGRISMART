import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMyExpertProfile, useUpsertMyExpertProfile } from '@/features/experts/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  specialization: z.string().trim().max(100).optional(),
  qualifications: z.string().trim().max(300).optional(),
  experienceYears: z.coerce.number().min(0).max(80).optional(),
  bio: z.string().trim().max(500).optional(),
  consultationFeeInr: z.coerce.number().min(0).optional(),
})

export default function ExpertProfilePage() {
  const { data: profile, isLoading } = useMyExpertProfile()
  const upsertProfile = useUpsertMyExpertProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (profile) {
      reset({
        specialization: profile.specialization,
        qualifications: profile.qualifications,
        experienceYears: profile.experienceYears,
        bio: profile.bio,
        consultationFeeInr: profile.consultationFeeInr,
      })
    }
  }, [profile, reset])

  const onSubmit = (values) => {
    upsertProfile.mutate(values)
  }

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading profile…</p>

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">My Expert Profile</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Farmers can only find and book you once you've filled this out.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Professional details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" placeholder="e.g. Plant Pathology" {...register('specialization')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input id="qualifications" placeholder="e.g. M.Sc. Agriculture" {...register('qualifications')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="experienceYears">Years of experience</Label>
                <Input id="experienceYears" type="number" {...register('experienceYears')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultationFeeInr">Consultation fee (₹)</Label>
                <Input id="consultationFeeInr" type="number" {...register('consultationFeeInr')} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} {...register('bio')} />
              {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
            </div>
            {upsertProfile.isError && <p className="text-destructive text-sm">Couldn't save your profile. Try again.</p>}
            {upsertProfile.isSuccess && <p className="text-sm text-green-600 dark:text-green-500">Saved.</p>}
            <Button type="submit" disabled={upsertProfile.isPending}>
              {upsertProfile.isPending ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
