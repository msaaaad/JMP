import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JudicialOfficer } from './judicial-officer.entity';
import { CreateJudicialOfficerDto } from './dto/create-judicial-officer.dto';
import { UpdateJudicialOfficerDto } from './dto/update-judicial-officer.dto';

@Injectable()
export class JudicialOfficersService {
    constructor(
        @InjectRepository(JudicialOfficer)
        private readonly repo: Repository<JudicialOfficer>,
    ) { }

    async create(dto: CreateJudicialOfficerDto) {
        const entity = this.repo.create({
            ...dto,
            dateOfBirth: new Date(dto.dateOfBirth),
            joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : null,
            promotionDate: dto.promotionDate ? new Date(dto.promotionDate) : null,
        } as JudicialOfficer);
        return this.repo.save(entity);
    }

    async createBatch(entities: CreateJudicialOfficerDto[]) {
        return this.repo.save(entities);
    }

    async findAll(): Promise<JudicialOfficer[]> {
        return this.repo.find();
    }

    async findOne(serviceId: string): Promise<JudicialOfficer> {
        const found = await this.repo.findOneBy({ serviceId });
        if (!found) throw new NotFoundException('Judicial officer not found');
        return found;
    }

    async update(serviceId: string, dto: UpdateJudicialOfficerDto) {
        const officer = await this.findOne(serviceId);
        Object.assign(officer, {
            ...dto,
            ...(dto.dateOfBirth ? { dateOfBirth: new Date(dto.dateOfBirth) } : {}),
            ...(dto.joiningDate ? { joiningDate: new Date(dto.joiningDate) } : {}),
            ...(dto.promotionDate ? { promotionDate: new Date(dto.promotionDate) } : {}),
        });
        return this.repo.save(officer);
    }

    async remove(serviceId: string) {
        const officer = await this.findOne(serviceId);
        return this.repo.remove(officer);
    }
}