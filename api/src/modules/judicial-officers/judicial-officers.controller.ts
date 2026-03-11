import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JudicialOfficersService } from './judicial-officers.service';
import { CreateJudicialOfficerDto } from './dto/create-judicial-officer.dto';
import { UpdateJudicialOfficerDto } from './dto/update-judicial-officer.dto';

@Controller('judicial-officers')
export class JudicialOfficersController {
    constructor(
        private readonly srvs: JudicialOfficersService
    ) {}

    @Post('create-batch')
    async createBatch(@Body() entities: CreateJudicialOfficerDto[]) {
        return this.srvs.createBatch(entities);
    }
    
    @Post()
    async create(@Body() dto: CreateJudicialOfficerDto) {
        return this.srvs.create(dto);
    }

    @Get()
    async findAll() {
        return this.srvs.findAll();
    }

    @Patch(':serviceId')
    async update(@Param('serviceId') serviceId: string, @Body() dto: UpdateJudicialOfficerDto) {
        return this.srvs.update(serviceId, dto);
    }

    @Delete(':serviceId')
    async remove(@Param('serviceId') serviceId: string) {
        return this.srvs.remove(serviceId);
    }
}
