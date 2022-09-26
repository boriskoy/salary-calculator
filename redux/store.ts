import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import thunk, { ThunkDispatch } from "redux-thunk"
import PositionsEditorReducer, { PositionsEditorAction } from "./positionsEditor/reducer"

type AppReduxAction = PositionsEditorAction

const rootReducer = combineReducers({
  positionsEditor: PositionsEditorReducer
})

export const store = createStore(rootReducer, {}, compose(applyMiddleware(thunk)))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, any, AppReduxAction> & typeof store.dispatch