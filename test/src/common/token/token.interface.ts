
export interface IJwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}


export interface IPurposeTokenPayload {
  sub: string; // user id
  email: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
