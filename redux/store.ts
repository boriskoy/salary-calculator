import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import thunk, { ThunkDispatch } from "redux-thunk"
import BenefitsEditorReducer, { BenefitsEditorAction } from "./benefitsEditor/reducer"
import PositionsEditorReducer, { PositionsEditorAction } from "./positionsEditor/reducer"

type AppReduxAction = PositionsEditorAction | BenefitsEditorAction

const rootReducer = combineReducers({
  positionsEditor: PositionsEditorReducer,
  benefitsEditor: BenefitsEditorReducer
})

export const store = createStore(rootReducer, {}, compose(applyMiddleware(thunk)))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, any, AppReduxAction> & typeof store.dispatch