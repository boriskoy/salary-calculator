import { BaseSalary, Position } from "../../supabase/database/types"
import { ADD_DELETE_POSITION, PositionsEditorType, UPDATE_FORM } from "./types"

interface BaseSalaryOptional {
  position?: number
  years: number
  salary: number
}

export interface PositionOptional {
  id?: number
  parent_template: string
  name: string
  base_salaries: BaseSalaryOptional[]
}

export type PositionsEditorState = {
  positions: PositionOptional[]
  deletePositions: Set<Position>
  deleteBaseSalaries: Set<BaseSalary>
}

export type PositionsEditorAction = {
  type: PositionsEditorType
  payload: Partial<PositionsEditorState> & { newDeletePosition: Position } | undefined
}

const initialState: PositionsEditorState = {
  positions: [],
  deletePositions: new Set(),
  deleteBaseSalaries: new Set()
}

const PositionsEditorReducer = (state: PositionsEditorState = initialState, action: PositionsEditorAction): PositionsEditorState => {
  switch (action.type) {
    case UPDATE_FORM:
      return {
        ...state,
        positions: action.payload?.positions ?? state.positions
      }
    case ADD_DELETE_POSITION:
      if (action.payload?.newDeletePosition) {
        state.deletePositions.add(action.payload.newDeletePosition)
      } 
      return {
        ...state
      }
    default:
      return state
  }
}

export default PositionsEditorReducer