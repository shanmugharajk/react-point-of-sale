import { ConnectionOptions } from 'typeorm';
import { isProd } from '@pos-api/utils';

const configDev: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'pos',
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: true,
  synchronize: true,
  dropSchema: false,
  cli: {
    migrationsDir: 'src/persistance/migrations',
  },
};

const configProd: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'pos',
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: false,
  cli: {
    migrationsDir: 'src/persistance/migrations',
  },
};

export const getConfig = () => (isProd() ? configProd : configDev);

export default { ...getConfig() };
