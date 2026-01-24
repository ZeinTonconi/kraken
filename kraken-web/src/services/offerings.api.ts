import { apiRequest } from './api';
import type { CourseOffering } from '../types/academics';

const OFFERINGS_AVAILABLE_ENDPOINT = '/offerings/available';

export const getAvailableOfferings = () => {
  return apiRequest<CourseOffering[]>(OFFERINGS_AVAILABLE_ENDPOINT);
};
