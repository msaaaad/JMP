import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getDatabaseConfig = (config: ConfigService): TypeOrmModuleOptions => {
  console.log('POSTGRES_HOST:', config.get('POSTGRES_HOST', 'db'));

  return {
    type: 'postgres',
    host: config.get('POSTGRES_HOST', 'db'),
    port: parseInt(config.get('POSTGRES_PORT', '5432'), 10),
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    database: config.get('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // dev only
    // logging: true,
  };
};