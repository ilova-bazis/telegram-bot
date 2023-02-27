-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "ts" DATETIME NOT NULL,
    "anchor" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Person" ("id", "name", "order", "ts") SELECT "id", "name", "order", "ts" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_order_key" ON "Person"("order");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
