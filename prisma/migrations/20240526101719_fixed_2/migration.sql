/*
  Warnings:

  - The primary key for the `teams_tournaments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `teams_tournaments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "teams_tournaments" DROP CONSTRAINT "teams_tournaments_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "teams_tournaments_pkey" PRIMARY KEY ("team_id", "tournament_id");
