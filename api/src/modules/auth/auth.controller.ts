import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestTokenDto } from './dto/request-token.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import express, { response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly srvs: AuthService
    ) { }

    @Post('request-token')
    async requestToken(@Body() payload: RequestTokenDto) {
        const { serviceId, dateOfBirth } = payload;
        return this.srvs.requestToken(serviceId, dateOfBirth);
    }

    @Post('set-password')
    async setPassword(@Body() payload: SetPasswordDto, @Res({ passthrough: true }) response: express.Response) {
        const { token, password } = payload;
        const { accessToken, refreshToken } = await this.srvs.setPassword(token, password);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh-token', // or '/auth/refresh-token' if you're strict
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return {
            message: 'Password set successfully',
            accessToken,
        };
    }

    @Post('login')
    async login(@Body() payload: LoginDto, @Res({ passthrough: true }) response: express.Response) {
        const { serviceId, password } = payload;
        const { accessToken, refreshToken } = await this.srvs.login(serviceId, password);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh-token', // or '/auth/refresh-token' if you're strict
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: express.Response) {
        response.clearCookie('refreshToken');
        return { message: 'Logout successful' };
    }

    @Post('refresh-token')
    async refreshToken(@Res({ passthrough: true }) response: express.Response) {
        const refreshToken = response.locals.refreshToken;
        const accessToken = await this.srvs.refreshToken(refreshToken);
        return { accessToken };
    }
}
