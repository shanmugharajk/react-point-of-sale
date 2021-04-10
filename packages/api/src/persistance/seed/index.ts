import { createConnection, Connection } from 'typeorm';
import { UsersEntity, UsersSubscriber } from '@pos-api/auth';

import connectionOptions from '../ormconfig';

async function createUsers(connection: Connection) {
  const usersRepository = connection.getRepository(UsersEntity);

  const sherlock = usersRepository.create({
    userId: 'sherlock',
    email: 'email@mail.com',
    userName: 'sherlock',
    password: 'sherlock@123',
    phone: '1234567890',
  });

  await usersRepository.save(sherlock);
}

async function main() {
  const connection: Connection = await createConnection({
    ...connectionOptions,
    subscribers: [UsersSubscriber],
  });

  await createUsers(connection);
  await connection.close();
}

try {
  main();
} catch (error) {
  console.log(error);
}
