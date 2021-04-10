import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthService],
})
export class AuthModule {}
