import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { TagsModule } from './tags/tags.module';
import { StreamsModule } from './streams/streams.module';
import { ProductsModule } from './products/products.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    NewsModule,
    TagsModule,
    StreamsModule,
    ProductsModule,
    TeamsModule,
    TournamentsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
