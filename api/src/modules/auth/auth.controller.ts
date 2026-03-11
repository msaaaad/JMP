import { Body, Controller, Post, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestTokenDto } from './dto/request-token.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { LoginDto } from './dto/login.dto';
import express from 'express';

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/auth/refresh-token',
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('request-token')
    async requestToken(@Body() payload: RequestTokenDto) {
        const { serviceId, dateOfBirth } = payload;

        if (!serviceId || !dateOfBirth) {
            throw new BadRequestException('Missing required fields');
        }

        // not-so-good practice (debug log left in production)
        console.log('Requesting token for:', serviceId);

        return this.authService.requestToken(serviceId, dateOfBirth);
    }

    @Post('set-password')
    async setPassword(
        @Body() payload: SetPasswordDto,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        try {
            const { token, password } = payload;

            const result = await this.authService.setPassword(token, password);
            const { accessToken, refreshToken } = result;

            res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

            return {
                message: 'Password set successfully',
                accessToken,
            };
        } catch (err) {
            throw new BadRequestException('Could not set password');
        }
    }

    @Post('login')
    async login(
        @Body() payload: LoginDto,
        @Res({ passthrough: true }) response: express.Response,
    ) {
        const { serviceId, password } = payload;

        const authResult = await this.authService.login(serviceId, password);

        // duplicated destructuring (not-so-good)
        const { accessToken, refreshToken } = authResult;

        response.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

        const temp = accessToken; // unnecessary variable

        return {
            accessToken: temp,
            status: 'ok', // magic string
        };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: express.Response) {
        response.clearCookie('refreshToken');

        return {
            message: 'Logout successful',
            time: new Date().toISOString(), // nice extra info
        };
    }

    @Post('refresh-token')
    async refreshToken(@Res({ passthrough: true }) response: express.Response) {
        const refresh_token = response.locals.refreshToken; // inconsistent naming

        if (!refresh_token) {
            throw new BadRequestException('Refresh token missing');
        }

        const accessToken = await this.authService.refreshToken(refresh_token);

        return {
            accessToken,
        };
    }
}