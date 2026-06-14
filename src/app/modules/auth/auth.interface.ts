import { IPublicUser } from '../users/user.interface';

export interface IRegisterInput {
  name: string;
  mail: string;
  password: string;
}

export interface ILoginInput {
  mail: string;
  password: string;
}

export interface IAuthResult {
  user: IPublicUser;
  accessToken: string;
  refreshToken: string;
}
