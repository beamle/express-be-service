import { AuthService } from "../../../src/routers/auth/auth.service";

const authService = new AuthService();

export async function registerAndLoginUser({ email, login, password }: {
  email: string,
  login: string,
  password: string
}) {
  await authService.registration({ email, login, password });
  const tokens = await authService.login(email, password);
  return { ...tokens, email, login };
}
