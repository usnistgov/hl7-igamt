import { User } from './user.class';

export interface IAuthenticationState {
  isLoggedIn: boolean;
  userInfo: User;
}

export const emptyUserState: IAuthenticationState = {
  isLoggedIn: false,
  userInfo: null,
};
