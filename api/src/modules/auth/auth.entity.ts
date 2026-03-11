import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JudicialOfficer } from "../judicial-officers/judicial-officer.entity";

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    serviceId: string

    @OneToOne(() => JudicialOfficer)
    @JoinColumn({ name: 'serviceId' })
    judicialOfficer: JudicialOfficer

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ default: false })
    isPasswordSet: boolean;
}