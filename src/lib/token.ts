import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.API_AUTH_KEY)

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

  return payload as CollabTokenPayload
}
