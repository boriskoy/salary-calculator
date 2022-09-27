import { ThunkAction } from "redux-thunk";
import { getTemplatePositions } from "../../supabase";
import { BaseSalary, Position } from "../../supabase/database/types";
import { AppDispatch, RootState } from "../store";
import { PositionOptional, PositionsEditorAction } from "./reducer";
import { ADD_DELETE_BASE_SALARY, ADD_DELETE_POSITION, EDIT_FORM, REFRESH_POSITIONS } from "./types";

export const refreshPositions = ({ templateId }: { templateId: string }): ThunkAction<void, RootState, any, PositionsEditorAction> => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const positions = await getTemplatePositions({ templateId })
    dispatch({
      type: REFRESH_POSITIONS,
      payload: {
        previousPositions: positions,
        positions: JSON.parse(JSON.stringify(positions)) as Position[]
      }
    })
  }
}

export const updatePositions = (positions: PositionOptional[]): ThunkAction<void, RootState, any, PositionsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: EDIT_FORM,
      payload: {
        positions
      }
    })
  }
}

export const addDeletePosition = (position: Position): ThunkAction<void, RootState, any, PositionsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: ADD_DELETE_POSITION,
      payload: {
        newDeletePosition: position
      }
    })
  }
}

export const addDeleteBaseSalary = (baseSalary: BaseSalary): ThunkAction<void, RootState, any, PositionsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: ADD_DELETE_BASE_SALARY,
      payload: {
        newDeleteBaseSalary: baseSalary
      }
    })
  }
}