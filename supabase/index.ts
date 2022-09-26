import { ApiError, Provider, Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "./client"
import { Position, Template, UserTemplate } from "./database/types";

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

export const signOut = async () => {
  return await supabaseClient.auth.signOut()
}

export const requestResetPassword = async ({ email }: { email: string }): Promise<SupabaseResponseType> => {
  return await supabaseClient.auth.api.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/admin/reset_password"
  })
}

export const retrieveAuthenticatedUserWithJwt = async ({ jwt }: { jwt: string }): Promise<SupabaseResponseType> => {
  return await supabaseClient.auth.api.getUser(jwt)
}

export const getUserTemplates = async ({ userId }: { userId: string }): Promise<Template[]> => {
  const userTemplateResponse = await supabaseClient
    .from<UserTemplate>("user_templates")
    .select()
    .eq("user_id", userId)
  const userTemplates = userTemplateResponse.data
  if (userTemplates == null) {
    return []
  }
  const templatesResponse = await supabaseClient
    .from<Template>("templates")
    .select()
    .in("id", userTemplates.map(userTemplate => userTemplate.template_id))
  return templatesResponse.data ?? []
}

export const getTemplatePositions = async ({ templateId }: { templateId: string }): Promise<Position[]> => {
  const response = await supabaseClient
    .from<Position>("positions")
    .select(`
      id,
      parent_template,
      name,
      base_salaries (
        position,
        years,
        salary
      )
    `)
    .eq("parent_template", templateId)
  return response.data ?? []
}

export const upsertTemplatePositions = async ({ positions }: { positions: Partial<Position>[] }): Promise<void> => {
  const positionEntities = positions.map(position => ({
    id: position.id,
    parent_template: position.parent_template,
    name: position.name,
  }))
  const response = await supabaseClient
    .from("positions")
    .upsert(positionEntities)
  if (response.error) {
    throw new Error(response.error.message)
  }
}

export const deleteTemplatePositions = async ({ positions }: { positions: Partial<Position>[] }): Promise<void> => {
  const positionIds = positions.map(position => position.id)
  const salariesDeleteResponse = await supabaseClient
    .from("base_salaries")
    .delete()
    .in("position", positionIds)
  if (salariesDeleteResponse.error) {
    throw new Error(salariesDeleteResponse.error.message)
  }
  const positionsDeleteResponse = await supabaseClient
    .from("positions")
    .delete()
    .in("id", positionIds)
  if (positionsDeleteResponse.error) {
    throw new Error(positionsDeleteResponse.error.message)
  }
}