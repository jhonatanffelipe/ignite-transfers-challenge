import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { hash } from 'bcryptjs';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Session', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should not be possible for the user to authenticate himself when there is no registered user', async () => {
    await expect(
      authenticateUserUseCase.execute({ email: 'johndoe@gmail.com', password: 'senhaincorreta' }),
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it('should not be possible for the user to authenticate with an incorrect password', async () => {
    const password = '123456';
    const passwordHash = await hash(password, 8);

    const user = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: passwordHash,
    };

    await usersRepository.create(user);

    await expect(
      authenticateUserUseCase.execute({ email: 'johndoe@gmail.com', password: 'senhaincorreta' }),
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it('should be possible for the user to authenticate in the application', async () => {
    const password = '123456';
    const passwordHash = await hash(password, 8);

    const user = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: passwordHash,
    };

    await usersRepository.create(user);

    const session = await authenticateUserUseCase.execute({ email: 'johndoe@gmail.com', password });

    expect(session).toHaveProperty('token');
  });
});
