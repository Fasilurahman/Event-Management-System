
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { TYPES } from '../../../constants/types';
import { inject, injectable } from 'inversify';

@injectable()
export class GetAllUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.getAllUsers();
    return users;
  }
}
