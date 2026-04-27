export interface User {
  username: string;
  fullName: string;
  role: "ADMIN" | "USER" | "GUEST";
  departmentId?: number;
  departmentName?: string;
  token: string;
}
