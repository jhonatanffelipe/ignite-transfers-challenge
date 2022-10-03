import { hash } from 'bcryptjs';
import request from 'supertest';

import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';
import { UsersRepository } from './../../../users/repositories/UsersRepository';
import { ICreateUserDTO } from './../../../users/useCases/createUser/ICreateUserDTO';

let connection: Connection;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: 'Password@123',
};

let access_token: string;

describe('Create satatement controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const usersRepository = new UsersRepository();

    await usersRepository.create({
      ...user,
      password: await hash(user.password, 8),
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password,
    });

    access_token = response.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('shoud be able create a new statement with type deposit', async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: 'Initial deposit',
        amount: 5000.5,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toEqual(201);
  });

  it('shoud not be able create a new statement with Invalid JWT token', async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: 'Initial deposit',
        amount: 5000.5,
      })
      .set({
        Authorization: `Bearer access_token`,
      });
    expect(response.status).toEqual(401);
  });
});
