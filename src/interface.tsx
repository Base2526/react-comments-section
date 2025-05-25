export enum Status {
  New = 'new',
  Edit = 'edit',
  Delete = 'delete'
}

export enum CommentStatus {
  Idle = 'idle',
  Posting = 'posting',
  Success = 'success',
  Error = 'error',
}

export interface Comment {
  userId: string
  parentId: string
  comId: string
  fullName: string
  avatarUrl: string
  text: string
  timestamp?: string
  userProfile?: string
  status?: CommentStatus
  replies?: Comment[]; 
}