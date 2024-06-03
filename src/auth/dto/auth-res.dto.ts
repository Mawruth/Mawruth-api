export class AuthResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    image?: string;
  };
}
