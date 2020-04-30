export interface ILoaderState {
  isLoading: boolean;
  uiIsBlocked: boolean;
  loading: number;
}

export const emptyLoaderState = {
  isLoading: false,
  uiIsBlocked: false,
  loading: 0,
};
