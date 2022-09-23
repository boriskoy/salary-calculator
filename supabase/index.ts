import { supabaseClient } from "./client"

export const signInWithEmailAndPassword = async ({ email, password }: { email: string, password: string }) => {
  return await supabaseClient.auth.signIn({
    email,
    password
  })
}