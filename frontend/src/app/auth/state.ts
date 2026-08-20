export type AuthActionState = {
  error: string | null;
};

export const initialAuthState: AuthActionState = {
  error: null,
};

export type PasswordResetActionState = {
  error: string | null;
  success: boolean;
};

export const initialPasswordResetState: PasswordResetActionState = {
  error: null,
  success: false,
};
