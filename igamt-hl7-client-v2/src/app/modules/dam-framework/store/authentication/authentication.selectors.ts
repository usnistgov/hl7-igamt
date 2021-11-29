import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthenticationState } from '../../models/authentication/state';
import { User } from '../../models/authentication/user.class';

export const authenticationFeatureName = 'damf-authentication';
export const selectAuth = createFeatureSelector<IAuthenticationState>(authenticationFeatureName);

export const selectIsLoggedIn = createSelector(
  selectAuth,
  (state: IAuthenticationState) => state.isLoggedIn,
);

export const selectUserInfo = createSelector(
  selectAuth,
  (state: IAuthenticationState) => {
    if (state.isLoggedIn) {
      return state.userInfo;
    } else {
      return undefined;
    }
  },
);

export const selectUsername = createSelector(
  selectUserInfo,
  (user: User) => {
    if (user) {
      return user.username;
    } else {
      return undefined;
    }
  },
);

export const selectAuthorities = createSelector(
  selectUserInfo,
  (user: User) => {
    if (user) {
      return user.authorities;
    } else {
      return [];
    }
  },
);

export const selectIsAdmin = createSelector(
  selectAuthorities,
  (authorities: string[]) => {
    return authorities.indexOf('ADMIN') !== -1;
  },
);
