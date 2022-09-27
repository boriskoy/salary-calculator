import { ThunkAction } from "redux-thunk";
import { getTemplateBenefits } from "../../supabase";
import { Benefit, BenefitOption } from "../../supabase/database/types";
import { AppDispatch, RootState } from "../store";
import { BenefitOptional, BenefitsEditorAction } from "./reducer";
import { ADD_DELETE_BENEFIT, ADD_DELETE_BENEFIT_OPTION, EDIT_FORM, REFRESH_BENEFITS } from "./types";

export const refreshBenefits = ({ templateId }: { templateId: string }): ThunkAction<void, RootState, any, BenefitsEditorAction> => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const benefits = await getTemplateBenefits({ templateId })
    dispatch({
      type: REFRESH_BENEFITS,
      payload: {
        previousBenefits: benefits,
        benefits: JSON.parse(JSON.stringify(benefits)) as Benefit[]
      }
    })
  }
}

export const updateBenefits = (benefits: BenefitOptional[]): ThunkAction<void, RootState, any, BenefitsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: EDIT_FORM,
      payload: {
        benefits
      }
    })
  }
}

export const addDeleteBenefit = (benefit: Benefit): ThunkAction<void, RootState, any, BenefitsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: ADD_DELETE_BENEFIT,
      payload: {
        newDeleteBenefit: benefit
      }
    })
  }
}

export const addDeleteBenefitOption = (benefitOption: BenefitOption): ThunkAction<void, RootState, any, BenefitsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: ADD_DELETE_BENEFIT_OPTION,
      payload: {
        newDeleteBenefitOption: benefitOption
      }
    })
  }
}