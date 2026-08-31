-- Byt namn på "nickname" -> "username" (behåll befintlig data),
-- lägg till "displayUsername" och "firstName" för username-pluginet.

ALTER TABLE "user" RENAME COLUMN "nickname" TO "username";
ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL;

ALTER TABLE "user" ADD COLUMN "displayUsername" TEXT;
ALTER TABLE "user" ADD COLUMN "firstName" TEXT;

-- Behåll originalskiftläge i displayUsername, normalisera username till gemener
-- (samma sätt som better-auth username-pluginet lagrar).
UPDATE "user" SET "displayUsername" = "username", "username" = lower("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
