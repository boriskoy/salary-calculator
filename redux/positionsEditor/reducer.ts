import { PositionsEditorType, UPDATE_FORM } from "./types"

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
}

export type PositionsEditorAction = {
  type: PositionsEditorType
  payload: Partial<PositionsEditorState> | undefined
}

const initialState: PositionsEditorState = {
  positions: []
}

const PositionsEditorReducer = (state: PositionsEditorState = initialState, action: PositionsEditorAction): PositionsEditorState => {
  switch (action.type) {
    case UPDATE_FORM:
      return {
        ...state,
        positions: action.payload?.positions ?? state.positions
      }
    default:
      return state
  }
}

export default PositionsEditorReducer