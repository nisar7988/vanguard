export interface API_Response<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface API_Response_Paginated<T> {
  data: T;
  message: string;
  success: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

// 🔥 Matches your NestJS exception filter EXACTLY
export interface API_Response_Error {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string; // message from backend
}
