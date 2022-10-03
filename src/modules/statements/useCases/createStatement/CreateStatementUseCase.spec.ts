import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { OperationType } from '../../entities/Statement';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('Create Statement', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it('should not be able create statement if user not exists', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: 'user_id_not-exists',
        type: OperationType.DEPOSIT,
        amount: 5000,
        description: 'Test deposit',
      }),
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it('should not be able create statement if insufficient founs', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Musar@123',
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id ? user.id : '',
        type: OperationType.WITHDRAW,
        amount: 5000,
        description: 'Test deposit',
      }),
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });

  it('should be able create statement', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Musar@123',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: 'Test deposit',
    });

    expect(statement).toHaveProperty('id');
  });
});
