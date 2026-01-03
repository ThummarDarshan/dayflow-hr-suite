export interface User {
  id: string;
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'admin';
  department: string;
  position: string;
  phone: string;
  address: string;
  joinDate: string;
  profilePicture?: string;
  isVerified: boolean;
}

export const mockUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'admin@dayflow.com',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'admin',
    department: 'Human Resources',
    position: 'HR Manager',
    phone: '+1 234 567 8901',
    address: '123 Corporate Blvd, Suite 100',
    joinDate: '2022-01-15',
    isVerified: true,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'john@dayflow.com',
    password: 'employee123',
    firstName: 'John',
    lastName: 'Smith',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    phone: '+1 234 567 8902',
    address: '456 Tech Park, Building A',
    joinDate: '2023-03-20',
    isVerified: true,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    email: 'jane@dayflow.com',
    password: 'employee123',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    phone: '+1 234 567 8903',
    address: '789 Business Center',
    joinDate: '2023-06-10',
    isVerified: true,
  },
];

export const departments = [
  'Human Resources',
  'Engineering',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
];

export const positions = [
  'Manager',
  'Senior Developer',
  'Software Developer',
  'Junior Developer',
  'Marketing Specialist',
  'Sales Representative',
  'Accountant',
  'HR Officer',
];
