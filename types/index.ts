export interface RequestBody {
  name: string;
  email: string;
  password?: string;
}

export interface Request {
  method: string;
  body: RequestBody;
}

export interface Response {
  json: (data: any) => any;
  status: (code: number) => {
    json: (data: any) => any;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  active: boolean;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

// HTTP method constants to avoid magic strings
export const HTTP_GET = 'GET' as const;
export const HTTP_POST = 'POST' as const;
export const HTTP_PUT = 'PUT' as const;
export const HTTP_DELETE = 'DELETE' as const;
