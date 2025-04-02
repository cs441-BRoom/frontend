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

  files: [];
}

export interface CreateAssignment {
  workspace_id: number;
  title: string;
  description: string;
  due_date: string;
  files: File[];
}
