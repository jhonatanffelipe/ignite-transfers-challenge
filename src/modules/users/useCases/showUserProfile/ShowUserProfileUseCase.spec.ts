import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able list an profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const profile = await showUserProfileUseCase.execute(user.id ? user.id : '');

    expect(profile).toHaveProperty('id');
  });

  it('should not be possible to list an unregistered user', async () => {
    await expect(showUserProfileUseCase.execute('ideinexistente')).rejects.toEqual(new ShowUserProfileError());
  });
});
