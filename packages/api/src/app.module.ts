import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '@pos-api/persistance';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.development.env' }),
    TypeOrmModule.forRoot({
      ...getConfig(),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
