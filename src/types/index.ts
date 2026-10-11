export interface StudentLoginRequest {
  email: string;
  password: string;
}

export interface StudentLoginResponse {
  studentId: number | string;
  registrationNumber: string;
  name: string;
  email: string;
  feeValid: boolean;
  message?: string;
}

export interface StudentProfile {
  id: number | string;
  registrationNumber: string;
  batch: string;
  department: string;
  rollNo: string;
  section: string;
  name: string;
  phone: string;
  email: string;
  stopName: string;
  cityName: string;
  feeValid: boolean;
  feeValidUntil?: string;
}

export interface StudentAssignment {
  hasAssignment: boolean;
  message?: string;
  busName?: string;
  routeName?: string;
  shiftName?: string;
  driverName?: string;
  driverPhone?: string;
  conductorName?: string;
  conductorPhone?: string;
  stopName?: string;
}

export interface RouteStop {
  id: number | string;
  stopName: string;
  sequenceOrder: number;
  pickupTime?: string;
  dropTime?: string;
}

export interface StudentRoute {
  id: number | string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  routeStops: RouteStop[];
}
