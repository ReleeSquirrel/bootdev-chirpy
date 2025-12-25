import * as argon2 from "argon2";

/**
 * Creates a Hash from a given password using argon2
 * @param password The password to hash
 * @returns A hash of the password, or an empty string on failure
 */
export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        if (err instanceof Error) console.log(`Notice: Password hashing failed with error ${err.message}`);
        else console.log(`Notice: Password hashing failed with error ${err}`);
        return "";
    }
}

/**
 * Tests if a password matches a given hash using argon2
 * @param password The password to test against the hash
 * @param hash The hash to test the password against
 */
export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) return true;
        else return false;
    } catch (err) {        
        if (err instanceof Error) console.log(`Notice: Password hash comparison failed with error ${err.message}`);
        else console.log(`Notice: Password hash comparison failed with error ${err}`);
        return false;
    }
}