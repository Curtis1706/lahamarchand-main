/*
  Warnings:

  - Made the column `isbn` on table `Work` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "disciplineId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submittedAt" DATETIME,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "concepteurId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "workId" TEXT,
    CONSTRAINT "Project_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_concepteurId_fkey" FOREIGN KEY ("concepteurId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "tva" REAL NOT NULL DEFAULT 0.18,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "disciplineId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,
    "concepteurId" TEXT,
    CONSTRAINT "Work_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Work_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Work_concepteurId_fkey" FOREIGN KEY ("concepteurId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Work" ("authorId", "concepteurId", "createdAt", "disciplineId", "id", "isbn", "price", "status", "title") SELECT "authorId", "concepteurId", "createdAt", "disciplineId", "id", "isbn", "price", "status", "title" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
CREATE UNIQUE INDEX "Work_isbn_key" ON "Work"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Project_workId_key" ON "Project"("workId");
