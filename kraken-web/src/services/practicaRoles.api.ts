import { apiRequest } from './api';
import type { PracticaRoleOptions } from '../types/academics';

export const getPracticaRoleOptions = (enrollmentId: string) => {
  return apiRequest<PracticaRoleOptions>(`/enrollments/${enrollmentId}/practica/role-options`);
};

export const setPracticaRoles = (
  enrollmentId: string,
  role1: string,
  role2: string,
) => {
  return apiRequest(`/enrollments/${enrollmentId}/practica/roles`, {
    method: 'POST',
    body: { role1, role2 },
  });
};
