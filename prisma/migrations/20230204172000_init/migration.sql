/*
  Warnings:

  - You are about to drop the column `anchor` on the `Person` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Completed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ts" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "ts" DATETIME NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Person" ("id", "name", "order", "ts") SELECT "id", "name", "order", "ts" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
