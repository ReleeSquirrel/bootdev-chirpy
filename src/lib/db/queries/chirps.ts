import { eq, asc } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { NotFoundError } from "../../../errors.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getChirpById(id: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id));
    if (result.length !== 1) throw new NotFoundError('File not found.');
    return result[0];
}

export async function getAllChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return result;
}