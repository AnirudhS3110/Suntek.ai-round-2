import { Body, Controller, Post,Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/currentuser.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){};

    @Post("register")
    register(@Body() dto:RegisterDto)
    {
        return this.authService.register(dto);
    }

    @Post("login")
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getMe(@CurrentUser() user:{userId:string,mail:string})
    {
        return user;
    }

}
