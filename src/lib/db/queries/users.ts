import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db
    .delete(users);
  return;
}

export async function getUserByEmail(email: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  return result;
}

export async function updatePasswordAndEmailByUserId(userId: string, password: string, email: string) {
  const [result] = await db
    .update(users)
    .set({email: email, hashedPassword: password})
    .where(eq(users.id, userId))
    .returning({email: users.email, id: users.id, createdAt: users.createdAt, updatedAt: users.updatedAt, isChirpyRed: users.isChirpyRed});
  return result;
}

export async function updateUpgradeUserToChirpyRedByUserId(userId: string) {
  const [result] = await db
    .update(users)
    .set({isChirpyRed: true})
    .where(eq(users.id, userId))
    .returning();
  return result;
}