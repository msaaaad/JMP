import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OfficerStatus } from "./enums/officer-status.enum";

@Entity('judicial_officers')
export class JudicialOfficer {
    @PrimaryColumn({ name: 'serviceId', type: 'varchar', length: 50 })
    serviceId: string

    @Column({ name: 'fullName', type: 'varchar', length: 50 })
    fullName: string

    @Column({ name: 'email', type: 'varchar', length: 50, nullable: true })
    email: string

    @Column({ name: 'surname', type: 'varchar', length: 50, nullable: true })
    surname: string

    @Column({ name: 'education', type: 'varchar', length: 50, nullable: true })
    education: string

    @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
    phone: string

    @Column({ name: 'dateOfBirth', type: 'date' })
    dateOfBirth: Date

    @Column({ name: 'district', type: 'varchar', length: 100, nullable: true })
    district?: string;

    @Column({ name: 'joiningDate', type: 'date', nullable: true })
    joiningDate?: Date;

    @Column({ name: 'promotionDate', type: 'date', nullable: true })
    promotionDate?: Date;

    @Column({ name: 'status', type: 'enum', enum: OfficerStatus, default: OfficerStatus.Unverified })
    status?: OfficerStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}