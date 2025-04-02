export interface Assignment {
  assignment_id: number;

  workspace_id: number;

  title: string;

  description: string;

  due_date: string;

  created_by: number;

  status: string;

  submitted_number: number;

  members: number;

  submission_date: string;

  score: number;

  files: AssignmentFile[];
}

export interface AssignmentFile {
  name: string;
  base64: string;
  mime_type: string;
}

export interface CreateAssignment {
  workspace_id: number;
  title: string;
  description: string;
  due_date: string;
  files: File[];
}

export interface SubmitAssignment {
  assignment_id: number;
  files: File[];
}
