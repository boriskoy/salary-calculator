import { Benefit, BenefitOption } from "../../supabase/database/types"
import { ADD_DELETE_BENEFIT, ADD_DELETE_BENEFIT_OPTION, BenefitsEditorType, COMMIT_FORM_EDITS, EDIT_FORM, REFRESH_BENEFITS, REVERT_FORM_EDITS } from "./types"

export interface BenefitOptionOptional {
  id?: number
  benefit?: number
  type: string
  value: string
  salary: number
}

export interface BenefitOptional {
  id?: number
  parent_template: string
  name: string
  type: string
  benefit_options: BenefitOptionOptional[]
}

export type BenefitsEditorState = {
  previousBenefits: BenefitOptional[]
  benefits: BenefitOptional[]
  deleteBenefits: Set<Benefit>
  deleteBenefitOptions: Set<BenefitOption>
}

export type BenefitsEditorAction = {
  type: BenefitsEditorType
  payload?: Partial<BenefitsEditorState & {
    newDeleteBenefit: Benefit
    newDeleteBenefitOption: BenefitOption
  }>
}

const initialState: BenefitsEditorState = {
  previousBenefits: [],
  benefits: [],
  deleteBenefits: new Set(),
  deleteBenefitOptions: new Set()
}

const BenefitsEditorReducer = (state: BenefitsEditorState = initialState, action: BenefitsEditorAction): BenefitsEditorState => {
  switch (action.type) {
    case REFRESH_BENEFITS:
      return {
        ...state,
        previousBenefits: action.payload?.previousBenefits ?? state.previousBenefits,
        benefits: action.payload?.benefits ?? state.benefits
      }
    case EDIT_FORM:
      return {
        ...state,
        previousBenefits: state.previousBenefits,
        benefits: action.payload?.benefits ?? state.benefits
      }
    case REVERT_FORM_EDITS:
      return {
        ...state,
        benefits: JSON.parse(JSON.stringify(state.previousBenefits))
      }
    case COMMIT_FORM_EDITS:
      return {
        ...state,
        previousBenefits: JSON.parse(JSON.stringify(state.benefits))
      }
    case ADD_DELETE_BENEFIT:
      if (action.payload?.newDeleteBenefit) {
        state.deleteBenefits.add(action.payload.newDeleteBenefit)
      } 
      return {
        ...state
      }
    case ADD_DELETE_BENEFIT_OPTION:
      if (action.payload?.newDeleteBenefitOption) {
        state.deleteBenefitOptions.add(action.payload.newDeleteBenefitOption)
      }
      return {
        ...state
      }
    default:
      return state
  }
}

export default BenefitsEditorReducer