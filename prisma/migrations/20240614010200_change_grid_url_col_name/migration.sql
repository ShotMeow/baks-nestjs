/*
  Warnings:

  - You are about to drop the column `gridUrl` on the `tournaments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "gridUrl",
ADD COLUMN     "grid_url" TEXT;
