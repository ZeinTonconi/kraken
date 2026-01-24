import { apiRequest } from './api';
import type { Enrollment } from '../types/academics';

export type ApplyPayload = {
  userId: string;
  track: 'PRACTICA_INTERNA' | 'INDUCCION';
  academicYear: number;
};

export const applyToOffering = (offeringId: string, payload: ApplyPayload) => {
  return apiRequest<Enrollment>(`/offerings/${offeringId}/apply`, {
    method: 'POST',
    body: payload,
  });
};
