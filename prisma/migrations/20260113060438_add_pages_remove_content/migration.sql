-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "noteId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_noteId_idx" ON "Page"("noteId");

-- CreateIndex
CREATE INDEX "Page_noteId_pageNumber_idx" ON "Page"("noteId", "pageNumber");

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "content";

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
