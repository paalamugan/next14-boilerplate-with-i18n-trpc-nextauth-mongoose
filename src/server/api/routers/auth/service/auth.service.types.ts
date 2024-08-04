import type { IUserSensitiveData } from '@/server/api/routers/users/model/user.model';
import type { RouterInputs } from '@/trpc/shared';

export type ServerSession = {
  user: IUserSensitiveData;
  sessionToken: string;
};

export type AddUserSessionArgs = {
  userId: IUserSensitiveData['id'];
  sessionToken: string;
  expiresIn: number;
};

export type DeleteSessionTokenArgs = {
  userId: IUserSensitiveData['id'];
  sessionToken: string;
};

export type SignOutArgs = {
  headers: Headers;
  session: ServerSession;
};

export type ValidateSessionTokenArgs = {
  encodedSessionToken: string;
  userId: IUserSensitiveData['id'];
  headers: Headers;
  validateSessionToken?: boolean;
};
export type ValidateSessionTokenResult =
  | {
      success: true;
      userInfo: ServerSession['user'] | null;
      sessionToken: string;
    }
  | {
      success: false;
    };

export type ValidateUserSessionResult =
  | {
      success: true;
      userInfo: ServerSession['user'] | null;
    }
  | {
      success: false;
    };

export type SignOutAllSessionsArgs = {
  headers: Headers;
  userId: IUserSensitiveData['id'];
};

export type SignInArgs = {
  input: RouterInputs['auth']['signIn'];
  headers: Headers;
};

export type SignUpArgs = {
  input: RouterInputs['auth']['signUp'];
  headers: Headers;
};

export type AccountVerifyArgs = {
  input: RouterInputs['auth']['accountVerify'];
};

export type ResetPasswordArgs = {
  input: RouterInputs['auth']['resetPassword'];
};

export type ForgotPasswordArgs = {
  input: RouterInputs['auth']['forgotPassword'];
};
