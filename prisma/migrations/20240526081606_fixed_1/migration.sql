-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "wins_percent" DROP NOT NULL,
ALTER COLUMN "games_count" DROP NOT NULL,
ALTER COLUMN "last_match" DROP NOT NULL;
