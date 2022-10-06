import { ApiError, Provider, Session, User } from "@supabase/supabase-js";
import { BenefitOptional, BenefitOptionOptional } from "../redux/benefitsEditor/reducer";
import { BaseSalaryOptional, PositionOptional } from "../redux/positionsEditor/reducer";
import { supabaseClient } from "./client"
import { BaseSalary, Benefit, BenefitOption, Position, Template, UserTemplate } from "./database/types";

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
    redirectTo: `${process.env.HOST_URL}/admin/reset_password`
  })
}

export const retrieveAuthenticatedUserWithJwt = async ({ jwt }: { jwt: string }): Promise<SupabaseResponseType> => {
  return await supabaseClient.auth.api.getUser(jwt)
}

export const getTemplate = async ({ templateId }: { templateId: string }): Promise<Template | null> => {
  const response = await supabaseClient
    .from<Template>("templates")
    .select()
    .eq("id", templateId)
  return response.data ? response.data[0] : null
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
      order,
      base_salaries (
        id,
        position,
        years,
        salary
      )
    `)
    .eq("parent_template", templateId)
    .order("order")
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
          name: position.name,
          order: position.order
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

export const upsertTemplateBenefits = async ({ benefits }: { benefits: BenefitOptional[] }): Promise<void> => {
  await Promise.all(benefits.map(async (benefit) => {
    if (benefit.id != null) {
      const { error } = await supabaseClient
        .from("benefits")
        .update({
          name: benefit.name,
          type: benefit.type
        })
        .eq("id", benefit.id)
      if (error) {
        throw new Error(error.message)
      }
      await upsertTemplateBenefitOptions({ benefitOptions: benefit.benefit_options })
    } else {
      const { data, error } = await supabaseClient
        .from<Benefit>("benefits")
        .insert({
          name: benefit.name,
          type: benefit.type,
          parent_template: benefit.parent_template
        })
      if (error) {
        throw new Error(error.message)
      }
      benefit.benefit_options.forEach(benefitOption => benefitOption.benefit = data[0].id)
      await upsertTemplateBenefitOptions({ benefitOptions: benefit.benefit_options })
    }
  }))
}

export const upsertTemplateBenefitOptions = async ({ benefitOptions }: { benefitOptions: BenefitOptionOptional[] }): Promise<void> => {
  await Promise.all(benefitOptions.map(async (benefitOption) => {
    if (benefitOption.id != null) {
      const { error } = await supabaseClient
        .from("benefit_options")
        .update({
          type: benefitOption.type,
          value: benefitOption.value,
          salary: benefitOption.salary
        })
        .eq("id", benefitOption.id)
      if (error) {
        throw new Error(error.message)
      }
    } else {
      const { error } = await supabaseClient
        .from("benefit_options")
        .insert(benefitOption)
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

export const deleteTemplateBenefits = async (benefits: Benefit[]): Promise<void> => {
  const benefitIds = benefits.map(benefit => benefit.id)
  const { error } = await supabaseClient
    .from("benefit_options")
    .delete()
    .in("benefit", benefitIds)
  if (error) {
    throw new Error(error.message)
  }
  const { error: error_2 } = await supabaseClient
    .from("benefits")
    .delete()
    .in("id", benefitIds)
  if (error_2) {
    throw new Error(error_2.message)
  }
}

export const deleteTemplateBenefitOptions = async (benefitOptions: BenefitOption[]): Promise<void> => {
  const benefitOptionIds = benefitOptions.map(benefitOption => benefitOption.id)
  const { error } = await supabaseClient
    .from("benefit_options")
    .delete()
    .in("id", benefitOptionIds)
  if (error) {
    throw new Error(error.message)
  }
}