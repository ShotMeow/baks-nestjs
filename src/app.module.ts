import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { TagsModule } from './tags/tags.module';
import { PrismaService } from './database/prisma.service';
import { StreamsModule } from './streams/streams.module';
import { ProductsModule } from './products/products.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [
    NewsModule,
    TagsModule,
    StreamsModule,
    ProductsModule,
    TeamsModule,
    TournamentsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
