export type ApplicationStatus = "APPLIED" | "APPROVED" | "REJECTED";

export type OfferingSummary = {
  id: string;
  name: string;
  secondary?: string | null;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export type StudentInfo = {
  id: string;
  fullName: string;
  email: string;
};

export type OfferingApplication = {
  id: string;
  offeringId: string;
  student: StudentInfo;
  track: "PRACTICA_INTERNA" | "INDUCCION";
  status: ApplicationStatus;
  createdAt: string;
};

export type ApplicationsQuery = {
  status?: ApplicationStatus | "ALL";
  q?: string;
  page?: number;
  pageSize?: number;
};

export type ApplicationsResponse = {
  items: OfferingApplication[];
  total: number;
};
