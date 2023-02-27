-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "telegramId" INTEGER NOT NULL,
    "ts" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "ts" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_order_key" ON "Person"("order");
