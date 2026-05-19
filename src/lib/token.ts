import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { env } from "../env.js";
import { collabTokenSchema } from "../schemas/auth.js";

const secret = new TextEncoder().encode(env.API_AUTH_KEY);

export interface CollabTokenPayload extends JWTPayload {
  uid: string;
}

export async function signCollabToken(payload: CollabTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(secret);
}

export async function verifyCollabToken(token: string) {
  // realtime 服务不适合大量 throw
  // 所以这里 catch 一下，返回 null
  try {
    const { payload } = await jwtVerify(token, secret);

    // Zod 校验 payload, 确保 uid 字段存在
    const result = collabTokenSchema.safeParse(payload);

    // 校验失败，返回 null
    if (!result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}
