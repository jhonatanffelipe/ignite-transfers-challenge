import { ICreateUserDTO } from './ICreateUserDTO';
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';
import { UsersRepository } from '../../repositories/UsersRepository';

let connection: Connection;

describe('Create  User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'testPassword@123',
    });

    expect(response.status).toEqual(201);
  });

  it('should not be able to create a new user when the email already exists', async () => {
    const usersRepository = new UsersRepository();

    const user: ICreateUserDTO = {
      name: 'John Doe Already Exists',
      email: 'johndoealreadyexists@email.com',
      password: 'testPassword@123',
    };

    await usersRepository.create(user);

    const response = await request(app).post('/api/v1/users').send(user);

    expect(response.status).toEqual(400);
  });
});
