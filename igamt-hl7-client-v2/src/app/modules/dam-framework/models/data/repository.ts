import { EntityState } from '@ngrx/entity';

export interface IRepositoryStore {
  collections: ICollections;
}

export interface ICollections {
  [collection: string]: EntityState<IDamResource>;
}

export interface IDamResource {
  id: string;
  type: string;
}

export const emptyRepository: IRepositoryStore = {
  collections: {},
};
