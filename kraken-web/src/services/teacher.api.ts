import { apiRequest } from './api';
import type { EnrollmentApplication } from '../types/academics';

export const getApplications = (offeringId: string) => {
  return apiRequest<EnrollmentApplication[]>(
    `/offerings/${offeringId}/applications?status=APPLIED`,
  );
};

export const approveEnrollment = (enrollmentId: string) => {
  return apiRequest(`/enrollments/${enrollmentId}/approve`, {
    method: 'POST',
  });
};
