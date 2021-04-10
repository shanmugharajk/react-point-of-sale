import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { getConfig } from '@pos-api/persistance';

import { AuthModule, UsersSubscriber } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.development.env' }),
    TypeOrmModule.forRoot({
      ...getConfig(),
      subscribers: [UsersSubscriber],
    }),
    AuthModule,
  ],
})
export class AppModule {}
