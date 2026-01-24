export type User = {
  id?: string;
  email: string;
  status?: string;
};

export type Profile = {
  fullName?: string | null;
  handle?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
};

export type Wallet = {
  coinsBalance: number;
  diamondsBalance: number;
};

export type Term = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  name: string;
};

export type CourseOffering = {
  id: string;
  course: Course;
  term: Term;
};

export type Enrollment = {
  id: string;
  status: string;
  track: string;
  primaryRole?: string | null;
  prefRole1?: string | null;
  prefRole2?: string | null;
  prefRole3?: string | null;
  offering: CourseOffering;
};

export type ProfileResponse = {
  user: User;
  profile: Profile;
};
