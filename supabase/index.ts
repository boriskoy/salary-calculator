import { ApiError, Provider, Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "./client"

export type SupabaseResponseType = Partial<{
  session: Session | null;
  user: User | null;
  provider?: Provider | undefined;
  url: string | null | undefined;
  data: {} | null;
  error: ApiError | null;
}>

export const signInWithEmailAndPassword = async ({ email, password }: { email: string, password: string }): Promise<SupabaseResponseType> => {
  const { user, session, error } = await supabaseClient.auth.signIn({
    email,
    password
  })
  if (session != null) {
    supabaseClient.auth.setAuth(session.access_token)
  }
  return {
    user,
    session,
    error
  }
}

export const requestResetPassword = async ({ email }: { email: string }): Promise<SupabaseResponseType> => {
  return await supabaseClient.auth.api.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/admin/reset_password"
  })
}

export const retrieveAuthenticatedUserWithJwt = async ({ jwt }: { jwt: string }): Promise<SupabaseResponseType> => {
  return await supabaseClient.auth.api.getUser(jwt)
}