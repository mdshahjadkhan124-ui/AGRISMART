import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMyProfile, useUpsertMyProfile } from '@/features/profile/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const profileSchema = z.object({
  address: z.string().trim().max(200).optional(),
  state: z.string().trim().max(100).optional(),
  district: z.string().trim().max(100).optional(),
  village: z.string().trim().max(100).optional(),
  pincode: z.string().trim().max(10).optional(),
  farmingExperienceYears: z.coerce.number().min(0).max(100).optional(),
  bio: z.string().trim().max(500).optional(),
})

type ProfileInput = z.input<typeof profileSchema>
type ProfileValues = z.output<typeof profileSchema>

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile()
  const upsertProfile = useUpsertMyProfile()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        address: profile.address,
        state: profile.state,
        district: profile.district,
        village: profile.village,
        pincode: profile.pincode,
        farmingExperienceYears: profile.farmingExperienceYears,
        bio: profile.bio,
      })
    }
  }, [profile, reset])

  const onSubmit = (values: ProfileValues) => {
    upsertProfile.mutate(values)
  }

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading profile…</p>

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Farm & contact details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="village">Village</Label>
                <Input id="village" {...register('village')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="district">District</Label>
                <Input id="district" {...register('district')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('state')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" {...register('pincode')} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="farmingExperienceYears">Years of farming experience</Label>
              <Input id="farmingExperienceYears" type="number" {...register('farmingExperienceYears')} />
              {errors.farmingExperienceYears && (
                <p className="text-destructive text-sm">{errors.farmingExperienceYears.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea id="bio" rows={3} {...register('bio')} />
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
