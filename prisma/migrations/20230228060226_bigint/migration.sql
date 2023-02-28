/*
  Warnings:

  - You are about to alter the column `channel_id` on the `Person` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "ts" DATETIME NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "channel_id" BIGINT NOT NULL
);
INSERT INTO "new_Person" ("channel_id", "current", "id", "name", "order", "ts") SELECT "channel_id", "current", "id", "name", "order", "ts" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
