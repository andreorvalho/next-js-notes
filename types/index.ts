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
