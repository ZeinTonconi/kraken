import type {
  ApplicationStatus,
  ApplicationsQuery,
  ApplicationsResponse,
  OfferingApplication,
  OfferingSummary,
} from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const offerings: OfferingSummary[] = [
  {
    id: "off-1",
    name: "Práctica Interna - 2026 ANUAL",
    secondary: "Track: PRACTICA_INTERNA",
    total: 18,
    pending: 8,
    approved: 7,
    rejected: 3,
  },
  {
    id: "off-2",
    name: "Inducción - 2026 ANUAL",
    secondary: "Track: INDUCCION",
    total: 24,
    pending: 10,
    approved: 11,
    rejected: 3,
  },
  {
    id: "off-3",
    name: "Inducción - 2025 SEMESTRAL",
    secondary: "Track: INDUCCION",
    total: 12,
    pending: 4,
    approved: 6,
    rejected: 2,
  },
];

let applicationsStore: OfferingApplication[] = [
  ...Array.from({ length: 12 }).map((_, index) => ({
    id: `app-1-${index}`,
    offeringId: "off-1",
    student: {
      id: `stu-${index}`,
      fullName: `Estudiante ${index + 1}`,
      email: `student${index + 1}@uni.com`,
    },
    track: "PRACTICA_INTERNA",
    status: index % 3 === 0 ? "APPROVED" : index % 3 === 1 ? "APPLIED" : "REJECTED",
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  })),
  ...Array.from({ length: 16 }).map((_, index) => ({
    id: `app-2-${index}`,
    offeringId: "off-2",
    student: {
      id: `stu-b-${index}`,
      fullName: `Postulante ${index + 1}`,
      email: `applicant${index + 1}@uni.com`,
    },
    track: "INDUCCION",
    status: index % 2 === 0 ? "APPLIED" : "APPROVED",
    createdAt: new Date(Date.now() - index * 43200000).toISOString(),
  })),
  ...Array.from({ length: 8 }).map((_, index) => ({
    id: `app-3-${index}`,
    offeringId: "off-3",
    student: {
      id: `stu-c-${index}`,
      fullName: `Aspirante ${index + 1}`,
      email: `candidate${index + 1}@uni.com`,
    },
    track: "INDUCCION",
    status: index % 2 === 0 ? "APPLIED" : "REJECTED",
    createdAt: new Date(Date.now() - index * 65000000).toISOString(),
  })),
];

const filterByStatus = (
  items: OfferingApplication[],
  status?: ApplicationStatus | "ALL",
) => {
  if (!status || status === "ALL") {
    return items;
  }
  return items.filter((item) => item.status === status);
};

const filterByQuery = (items: OfferingApplication[], query?: string) => {
  if (!query) {
    return items;
  }
  const q = query.toLowerCase().trim();
  if (!q) {
    return items;
  }
  return items.filter(
    (item) =>
      item.student.fullName.toLowerCase().includes(q) ||
      item.student.email.toLowerCase().includes(q),
  );
};

const updateOfferingCounts = () => {
  offerings.forEach((offering) => {
    const related = applicationsStore.filter(
      (app) => app.offeringId === offering.id,
    );
    offering.total = related.length;
    offering.pending = related.filter((app) => app.status === "APPLIED").length;
    offering.approved = related.filter((app) => app.status === "APPROVED").length;
    offering.rejected = related.filter((app) => app.status === "REJECTED").length;
  });
};

export const fetchOfferings = async () => {
  await delay(400);
  updateOfferingCounts();
  return offerings;
};

export const fetchApplications = async (
  offeringId: string,
  query: ApplicationsQuery,
): Promise<ApplicationsResponse> => {
  await delay(450);
  const { status, q, page = 1, pageSize = 10 } = query;
  const base = applicationsStore.filter((app) => app.offeringId === offeringId);
  const filtered = filterByQuery(filterByStatus(base, status), q);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total };
};

export const approveApplication = async (applicationId: string) => {
  await delay(350);
  applicationsStore = applicationsStore.map((app) =>
    app.id === applicationId ? { ...app, status: "APPROVED" } : app,
  );
};

export const rejectApplication = async (applicationId: string) => {
  await delay(350);
  applicationsStore = applicationsStore.map((app) =>
    app.id === applicationId ? { ...app, status: "REJECTED" } : app,
  );
};
