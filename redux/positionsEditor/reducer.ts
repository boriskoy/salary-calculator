import { BaseSalary, Position } from "../../supabase/database/types"
import { ADD_DELETE_BASE_SALARY, ADD_DELETE_POSITION, COMMIT_FORM_EDITS, EDIT_FORM, PositionsEditorType, REFRESH_POSITIONS, REVERT_FORM_EDITS } from "./types"

export interface BaseSalaryOptional {
  id?: number
  position?: number
  years: number
  salary: number
}

export interface PositionOptional {
  id?: number
  parent_template: string
  name: string
  order: number
  base_salaries: BaseSalaryOptional[]
}

export type PositionsEditorState = {
  previousPositions: PositionOptional[]
  positions: PositionOptional[]
  deletePositions: Set<Position>
  deleteBaseSalaries: Set<BaseSalary>
}

export type PositionsEditorAction = {
  type: PositionsEditorType
  payload?: Partial<PositionsEditorState & {
    newDeletePosition: Position
    newDeleteBaseSalary: BaseSalary
  }>
}

const initialState: PositionsEditorState = {
  previousPositions: [],
  positions: [],
  deletePositions: new Set(),
  deleteBaseSalaries: new Set()
}

const PositionsEditorReducer = (state: PositionsEditorState = initialState, action: PositionsEditorAction): PositionsEditorState => {
  switch (action.type) {
    case REFRESH_POSITIONS:
      return {
        ...state,
        previousPositions: action.payload?.previousPositions ?? state.previousPositions,
        positions: action.payload?.positions ?? state.positions
      }
    case EDIT_FORM:
      return {
        ...state,
        previousPositions: state.previousPositions,
        positions: action.payload?.positions ?? state.positions
      }
    case REVERT_FORM_EDITS:
      return {
        ...state,
        positions: JSON.parse(JSON.stringify(state.previousPositions))
      }
    case COMMIT_FORM_EDITS:
      return {
        ...state,
        previousPositions: JSON.parse(JSON.stringify(state.positions))
      }
    case ADD_DELETE_POSITION:
      if (action.payload?.newDeletePosition) {
        state.deletePositions.add(action.payload.newDeletePosition)
      } 
      return {
        ...state
      }
    case ADD_DELETE_BASE_SALARY:
      if (action.payload?.newDeleteBaseSalary) {
        state.deleteBaseSalaries.add(action.payload.newDeleteBaseSalary)
      }
      return {
        ...state
      }
    default:
      return state
  }
}

export default PositionsEditorReducer