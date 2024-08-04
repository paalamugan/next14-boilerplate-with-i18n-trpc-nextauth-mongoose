import { type ServerSession } from './service/auth.service.types';

export type MeQueryResult = {
  user: ServerSession['user'];
};
