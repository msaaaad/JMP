import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JudicialOfficer } from '../judicial-officers/judicial-officer.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private readonly repo: Repository<Auth>,

        @InjectRepository(JudicialOfficer)
        private readonly judicialOfficerRepo: Repository<JudicialOfficer>,

        private jwtService: JwtService
    ) { }

    async requestToken(serviceId: string, dateOfBirth: string) {
        const officer = await this.judicialOfficerRepo.findOneBy({ serviceId });

        if (!officer || (new Date(officer.dateOfBirth).toISOString().split('T')[0] !== dateOfBirth)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.jwtService.sign(
            { serviceId, type: 'register' },
            { expiresIn: '5m' },
        );
    }

    async setPassword(token: string, password: string) {
        try {
            const payload = this.jwtService.verify(token);

            if (payload.type !== 'register' || !payload.serviceId) {
                throw new UnauthorizedException('Invalid or expired token');
            }

            let entity = await this.repo.findOneBy({ serviceId: payload.serviceId });

            if (entity) {
                throw new BadRequestException('User already registered');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            entity = this.repo.create({
                serviceId: payload.serviceId,
                password: passwordHash,
                isPasswordSet: true,
            });

            await this.repo.save(entity);

            const accessToken = this.jwtService.sign(
                { serviceId: entity.serviceId, type: 'access' },
                { expiresIn: '15m' }
            );

            const refreshToken = this.jwtService.sign(
                { serviceId: entity.serviceId, type: 'refresh' },
                { expiresIn: '30d' }
            );

            return {
                message: 'Password set successfully. Registration complete.',
                accessToken,
                refreshToken,
            };
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    async create(serviceId: string, password: string) {
        const entity = this.repo.create({ serviceId, password, isPasswordSet: true } as Auth);
        return this.repo.save(entity);
    }

    async login(serviceId: string, password: string) {
        const entity = await this.repo.findOneBy({ serviceId });
        if (!entity || !entity.isPasswordSet) throw new UnauthorizedException('Invalid credentials');
        const isValid = await bcrypt.compare(password, entity.password);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');
        const accessToken = this.jwtService.sign({ serviceId, type: 'access' }, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ serviceId, type: 'refresh' }, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            if (payload.type !== 'refresh' || !payload.serviceId) {
                throw new UnauthorizedException('Invalid or expired token');
            }
            const accessToken = this.jwtService.sign({ serviceId: payload.serviceId, type: 'access' }, { expiresIn: '15m' });
            return { accessToken };
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
