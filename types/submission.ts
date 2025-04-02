export interface Submission {
  submission_id: string;

  assignment_id: string;

  user_id: string;

  score: string;

  submit_at: string;

  status: string;

  files: [];
}

export interface CreateSubmission {
  submission_id: string;

  assignment_id: string;

  user_id: string;

  score: string;

  submit_at: string;
}
