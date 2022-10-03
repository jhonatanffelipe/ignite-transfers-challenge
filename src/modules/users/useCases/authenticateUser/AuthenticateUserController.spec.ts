import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';
import { UsersRepository } from '../../repositories/UsersRepository';
import { hash } from 'bcryptjs';

let connection: Connection;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: 'Password@123',
};

describe('Authenticate Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const usersRepository = new UsersRepository();

    await usersRepository.create({
      ...user,
      password: await hash(user.password, 8),
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate to the application', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });
});
