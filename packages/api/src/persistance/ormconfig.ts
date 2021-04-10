import { ConnectionOptions } from 'typeorm';
import { isProd } from '@pos-api/utils';

const configDev: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'r_accounts',
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/persistence/migrations/*{.ts,.js}'],
  logging: true,
  synchronize: true,
  dropSchema: false,
};

const configProd: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'r_accounts',
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/persistence/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: false,
};

export const getConfig = () => (isProd() ? configProd : configDev);
