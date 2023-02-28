-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "ts" DATETIME NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "channel_id" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Person" ("current", "id", "name", "order", "ts") SELECT "current", "id", "name", "order", "ts" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
