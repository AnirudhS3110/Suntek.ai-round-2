import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import { env } from 'src/config/env';
import { AuthRepositoryService } from './repository/auth.repository';

@Module({
  imports: [PassportModule,JwtModule.register({secret:env.jwtSecret,signOptions:{expiresIn:"7d"}})],
  controllers: [AuthController],
  providers: [AuthService,AuthRepositoryService],
  exports:[AuthService]
})
export class AuthModule {}
