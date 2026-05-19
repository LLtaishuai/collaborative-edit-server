import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { env } from '../env.js'
import { collabTokenSchema } from '../schemas/auth.js'

const secret = new TextEncoder().encode(env.API_AUTH_KEY)

export interface CollabTokenPayload extends JWTPayload {
  uid: string
}

export async function signCollabToken(payload: CollabTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('60s')
    .sign(secret)
}

export async function verifyCollabToken(token: string) {
  const { payload } = await jwtVerify(token, secret)

  /**
   * Zod 校验 payload
   */
  return collabTokenSchema.parse(payload) as CollabTokenPayload
}
