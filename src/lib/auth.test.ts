import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth.js";
import { BadRequestError } from "../errors";
import { config } from "../config.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT Creation and Validation", () => {
    const testSecret = "It's a Secret to Everybody.";
    const testUserID = "It's Steve";
    let jwt1: string;
    let jwt2: string;
    let jwt3: string;

    beforeAll(async () => {
        jwt1 = makeJWT(testUserID, 86400, testSecret);
        jwt2 = makeJWT(testUserID, 0, testSecret);
        jwt3 = makeJWT(testUserID, 86400, "wrong secret!");
    })

    it("should return value of testUserID", async () => {
        const result = await validateJWT(jwt1, testSecret);
        await expect(result).toBe(testUserID);
    });

    it("should return an error because the JWT is expired", async () => {
        await expect(async () => await validateJWT(jwt2, testSecret)).rejects.toThrow(BadRequestError);
    });

    it("should return an error because it was signed with the wrong secret", async () => {
        await expect(async () => await validateJWT(jwt3, testSecret)).rejects.toThrow(BadRequestError);
    });
});