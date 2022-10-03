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

describe('Show Profile Controller', () => {
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

  it('should be able show profile', async () => {
    const authentication = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password,
    });

    const { token } = authentication.body;

    const response = await request(app)
      .get('/api/v1/profile')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toEqual(200);
  });

  it('should not be able show profile when user not exists', async () => {
    const response = await request(app)
      .get('/api/v1/profile')
      .send()
      .set({
        Authorization: `Bearer ${'token_not_exists'}`,
      });

    expect(response.status).toEqual(401);
  });
});
