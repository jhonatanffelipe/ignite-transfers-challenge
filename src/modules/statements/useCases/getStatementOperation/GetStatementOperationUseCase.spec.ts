import { OperationType } from './../../entities/Statement';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { GetStatementOperationError } from './GetStatementOperationError';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository,
    );
  });

  it('should not be able list statement opration when user not exists', async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: 'user_id_non-existent',
        statement_id: 'statement_id_non-existent',
      }),
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it('should not be able list statement opration when statement opration not exists', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Musar@123',
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id ? user.id : '',
        statement_id: 'statement_id_non-existent',
      }),
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it('should be able list statement opration', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Musar@123',
    });

    const statement = await statementsRepository.create({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: 'Test deposit',
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id ? user.id : '',
      statement_id: statement.id ? statement.id : '',
    });

    expect(statementOperation).toHaveProperty('id');
  });
});
