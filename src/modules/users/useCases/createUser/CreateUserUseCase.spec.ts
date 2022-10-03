import { ICreateUserDTO } from './ICreateUserDTO';
import { CreateUserUseCase } from './CreateUserUseCase';

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able create a new user', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Mudar@123456',
    };

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty('id');
  });

  it('should not be possible to register a new user with an already used email ', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Mudar@123456',
    };

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user)).rejects.toEqual(new CreateUserError());
  });
});
