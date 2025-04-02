export interface Submission {
  submission_id: number;

  assignment_id: number;

  user_id: number;

  score: number;

  submit_at: string;

  status: string;

  files: SubmissionFile[];
}

export interface SubmissionFile {
  name: string;
  base64: string;
  mime_type: string;
}

export interface UpdateScore {
  submission_id: number;
  score: number;
}
