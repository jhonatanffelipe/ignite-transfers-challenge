import { GetBalanceError } from './GetBalanceError';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository,
    );
  });

  it('should not be able list balance when user not exists', async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: 'user_id_non-existent' }),
    ).rejects.toEqual(new GetBalanceError());
  });

  it('should be able list balance', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Musar@123',
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id ? user.id : '',
    });

    expect(balance).toHaveProperty('statement');
  });
});
