import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(refresh_token: NewRefreshToken): Promise<NewRefreshToken> {
  const [result] = await db
    .insert(refreshTokens)
    .values(refresh_token)
    .returning();
  return result;
}

export async function getRefreshToken(token: string): Promise<NewRefreshToken> {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return result;
}

export async function setRefreshTokenRevoked(token: string): Promise<void> {
  await db
    .update(refreshTokens)
    .set({revokedAt: new Date(Date.now())})
    .where(eq(refreshTokens.token, token));
}