import { apiRequest } from './api';
import type { EnrollmentApplication } from '../types/academics';

export const getApplications = (offeringId: string, status?: string) => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest<EnrollmentApplication[]>(
    `/offerings/${offeringId}/applications${query}`,
  );
};

export const approveEnrollment = (enrollmentId: string) => {
  return apiRequest(`/enrollments/${enrollmentId}/approve`, {
    method: 'POST',
  });
};
