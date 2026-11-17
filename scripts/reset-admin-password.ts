import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { user, account } from "../src/db/schema";
import { auth } from "../src/modules/auth/lib/auth";

async function main() {
  const targetEmail = process.argv[2] || "admin@tepegrafi.id";
  const newPassword = process.argv[3] || "272800";

  console.log(`Resetting password for: ${targetEmail}`);

  // 1. Find user by email
  const users = await db
    .select()
    .from(user)
    .where(eq(user.email, targetEmail))
    .limit(1);

  if (users.length === 0) {
    throw new Error(`User with email "${targetEmail}" not found in database.`);
  }

  const targetUser = users[0];
  console.log(`User found: ${targetUser.name} (${targetUser.id})`);

  // 2. Hash new password using Better Auth's password hasher
  const ctx = await (auth as unknown as { $context: Promise<{ password: { hash: (p: string) => Promise<string>; verify: (opts: { password: string; hash: string }) => Promise<boolean> } }> })["$context"];
  const hashedPassword = await ctx.password.hash(newPassword);

  // 3. Find or update credential account
  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.userId, targetUser.id));

  const credentialAccount = accounts.find((a) => a.providerId === "credential");

  if (credentialAccount) {
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(account.id, credentialAccount.id));

    console.log(`Existing credential account updated (${credentialAccount.id}).`);
  } else {
    // If no credential account existed, create one
    const newAccountId = crypto.randomUUID();
    await db.insert(account).values({
      id: newAccountId,
      accountId: targetUser.id,
      providerId: "credential",
      userId: targetUser.id,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`New credential account created (${newAccountId}).`);
  }

  // 4. Verify that the newly stored hash works
  const verifyAcc = await db
    .select()
    .from(account)
    .where(eq(account.userId, targetUser.id));

  const currentCred = verifyAcc.find((a) => a.providerId === "credential");
  if (!currentCred?.password) {
    throw new Error("Verification failed: Account password is empty.");
  }

  const isVerified = await ctx.password.verify({
    password: newPassword,
    hash: currentCred.password,
  });

  if (!isVerified) {
    throw new Error("Verification failed: Hash verification returned false.");
  }

  console.log("SUCCESS: Password successfully reset and verified!");
}

main().catch((err) => {
  console.error("Error resetting password:", err);
  process.exit(1);
});
