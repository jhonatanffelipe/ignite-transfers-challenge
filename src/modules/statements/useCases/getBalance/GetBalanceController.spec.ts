import { StatementsRepository } from './../../repositories/StatementsRepository';
import { hash } from 'bcryptjs';
import request from 'supertest';

import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';
import { UsersRepository } from '../../../users/repositories/UsersRepository';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { OperationType } from '../../entities/Statement';

let connection: Connection;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: 'Password@123',
};

let user_id: string;
let access_token: string;

describe('Get balance controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const usersRepository = new UsersRepository();
    const statementsRepository = new StatementsRepository();

    await usersRepository.create({
      ...user,
      password: await hash(user.password, 8),
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password,
    });

    user_id = response.body.user.id;
    access_token = response.body.token;

    await statementsRepository.create({
      user_id,
      amount: 5000,
      description: 'Initial deposit',
      type: OperationType.DEPOSIT,
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('shoud be able list balance', async () => {
    const response = await request(app)
      .get('/api/v1/statements/balance')
      .send()
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toEqual(200);
    expect(response.body.statement[0]).toHaveProperty('id');
  });
});
