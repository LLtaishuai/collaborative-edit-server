import { z } from 'zod'

export const collabTokenSchema = z.object({
  uid: z.string().min(1)
})

