import { IPublicUser } from '../users/user.interface';

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResult {
  user: IPublicUser;
  accessToken: string;
  refreshToken: string;
}
