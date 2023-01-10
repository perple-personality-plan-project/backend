import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { UserModule } from 'src/api/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
