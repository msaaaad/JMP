import { PartialType } from "@nestjs/mapped-types";
import { CreateJudicialOfficerDto } from "./create-judicial-officer.dto";

export class UpdateJudicialOfficerDto extends PartialType(CreateJudicialOfficerDto) {}