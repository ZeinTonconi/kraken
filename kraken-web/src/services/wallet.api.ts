import { apiRequest } from './api';
import type { Wallet } from '../types/academics';

const WALLET_ENDPOINT = '/wallets/:userId';

export const getWallet = (userId: string) => {
  return apiRequest<Wallet>(WALLET_ENDPOINT.replace(':userId', userId));
};
