-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "notes" TEXT,
    "items" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'EFT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("adminNotes", "createdAt", "customerAddress", "customerEmail", "customerName", "customerPhone", "id", "items", "notes", "orderNumber", "paymentMethod", "status", "total", "updatedAt") SELECT "adminNotes", "createdAt", "customerAddress", "customerEmail", "customerName", "customerPhone", "id", "items", "notes", "orderNumber", "paymentMethod", "status", "total", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
