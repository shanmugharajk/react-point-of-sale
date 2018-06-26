import { createConnection, Connection } from "typeorm";

export const openConnection: any = async () =>
  await createConnection({
    type: "sqlite",
    database: "database.sqlite",
    entities: [__dirname + "/../entity/*.ts"],
    migrations: [__dirname + "/../persistence/migration/*.ts"],
    logging: true,
    synchronize: false
  });
