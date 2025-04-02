export interface Submission {
  submission_id: string;

  assignment_id: string;

  user_id: string;

  score: string;

  submit_at: string;

  status: string;

  files: SubmissionFile[];
}

export interface SubmissionFile {
  name: string;
  base64: string;
  mime_type: string;
}

export interface CreateSubmission {
  submission_id: string;

  assignment_id: string;

  user_id: string;

  score: string;

  submit_at: string;
}
