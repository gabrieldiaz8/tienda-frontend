import { UserInterface } from './user.interface';

export interface LoginResponseInterface {
  accessToken: string;
  refreshToken: string;
  role: string;
  user: UserInterface;
}
