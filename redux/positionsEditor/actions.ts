import { ThunkAction } from "redux-thunk";
import { getTemplatePositions } from "../../supabase";
import { AppDispatch, RootState } from "../store";
import { PositionOptional, PositionsEditorAction } from "./reducer";
import { UPDATE_FORM } from "./types";

export const refreshPositions = ({ templateId }: { templateId: string }): ThunkAction<void, RootState, any, PositionsEditorAction> => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const positions = await getTemplatePositions({ templateId })
    dispatch({
      type: UPDATE_FORM,
      payload: {
        positions
      }
    })
  }
}

export const updatePositions = (positions: PositionOptional[]): ThunkAction<void, RootState, any, PositionsEditorAction> => {
  return (dispatch: AppDispatch): void => {
    dispatch({
      type: UPDATE_FORM,
      payload: {
        positions
      }
    })
  }
}