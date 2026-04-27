export interface Ticket {
  id?: number;
  ticketNumber?: string;
  departmentName?: string;
  issueType: string;
  status: "SUBMITTED" | "IN_PROGRESS" | "RESOLVED";
  anonymous: boolean;
  raisedBy?: string;
  assignedTo?: string;
  description: string;
  priority: string;
  fields?: TicketField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketField {
  fieldName: string;
  fieldValue: string;
  fieldType: "TEXT" | "NUMBER" | "SELECT";
}

export interface Department {
  id: number;
  name: string;
  code: string;
  icon: string;
  description: string;
  issueTypesJson: string;
}
