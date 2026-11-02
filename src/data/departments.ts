export const DEPARTMENTS = [
  'Product & Engineering',
  'People Operations & HR',
  'Executive & Board Suite',
  'Security & Compliance',
  'Finance & Legal',
  'Enterprise Sales & Partnerships',
  'Operations & Facilities',
] as const;

export type DepartmentName = typeof DEPARTMENTS[number];

