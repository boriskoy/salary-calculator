import { ApiError, Provider, Session, User } from "@supabase/supabase-js";
import { BaseSalaryOptional, PositionOptional } from "../redux/positionsEditor/reducer";
import { supabaseClient } from "./client"
import { BaseSalary, Benefit, Position, Template, UserTemplate } from "./database/types";

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
    .order("name")
  return templatesResponse.data ?? []
}

export const getTemplatePositions = async ({ templateId }: { templateId: string }): Promise<Position[]> => {
  const response = await supabaseClient
    .from("positions")
    .select(`
      id,
      parent_template,
      name,
      base_salaries (
        id,
        position,
        years,
        salary
      )
    `)
    .eq("parent_template", templateId)
    .order("name")
    .order("years", { foreignTable: "base_salaries" })
  return response.data ?? []
}

export const getTemplateBenefits = async ({ templateId }: { templateId: string }): Promise<Benefit[]> => {
  const response = await supabaseClient
    .from("benefits")
    .select(`
      id,
      parent_template,
      name,
      type,
      benefit_options (
        id,
        benefit,
        type,
        value,
        salary
      )
    `)
    .eq("parent_template", templateId)
    .order("name")
    .order("salary", { foreignTable: "benefit_options" })
  return response.data ?? []
}

export const upsertTemplatePositions = async ({ positions }: { positions: PositionOptional[] }): Promise<void> => {
  await Promise.all(positions.map(async (position) => {
    if (position.id != null) {
      const { error } = await supabaseClient
        .from("positions")
        .update({
          name: position.name
        })
        .eq("id", position.id)
      if (error) {
        throw new Error(error.message)
      }
      await upsertBaseSalaries({ baseSalaries: position.base_salaries })
    } else {
      const { data, error } = await supabaseClient
        .from<Position>("positions")
        .insert({
          name: position.name,
          parent_template: position.parent_template
        })
      if (error) {
        throw new Error(error.message)
      }
      position.base_salaries.forEach(baseSalary => baseSalary.position = data[0].id)
      console.log(position)
      await upsertBaseSalaries({ baseSalaries: position.base_salaries })
    }
  }))
}

export const upsertBaseSalaries = async ({ baseSalaries }: { baseSalaries: BaseSalaryOptional[] }): Promise<void> => {
  await Promise.all(baseSalaries.map(async (baseSalary) => {
    if (baseSalary.id != null) {
      const { error } = await supabaseClient
        .from("base_salaries")
        .update({
          years: baseSalary.years,
          salary: baseSalary.salary
        })
        .eq("id", baseSalary.id)
      if (error) {
        throw new Error(error.message)
      }
    } else {
      const { error } = await supabaseClient
        .from("base_salaries")
        .insert(baseSalary)
      if (error) {
        throw new Error(error.message)
      }
    }
  }))
}

export const deleteTemplatePositions = async (positions: Position[]): Promise<void> => {
  const positionIds = positions.map(position => position.id)
  const { error } = await supabaseClient
    .from("base_salaries")
    .delete()
    .in("position", positionIds)
  if (error) {
    throw new Error(error.message)
  }
  const { error: error_2 } = await supabaseClient
    .from("positions")
    .delete()
    .in("id", positionIds)
  if (error_2) {
    throw new Error(error_2.message)
  }
}

export const deleteTemplateBaseSalaries = async (baseSalaries: BaseSalary[]): Promise<void> => {
  const baseSalaryIds = baseSalaries.map(baseSalary => baseSalary.id)
  const { error } = await supabaseClient
    .from("base_salaries")
    .delete()
    .in("id", baseSalaryIds)
  if (error) {
    throw new Error(error.message)
  }
}