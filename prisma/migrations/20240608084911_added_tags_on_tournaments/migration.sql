-- CreateTable
CREATE TABLE "tags_tournaments" (
    "tournament_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_tournaments_pkey" PRIMARY KEY ("tournament_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "tags_tournaments" ADD CONSTRAINT "tags_tournaments_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_tournaments" ADD CONSTRAINT "tags_tournaments_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
