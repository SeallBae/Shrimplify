export interface User {
  name: string;
  password?: string;
  access_token: string;
  refresh_token: string;
  isAdmin: boolean;
}

export interface JwtPayload {
  user: string;
  exp: number;
  iat: number;
}
