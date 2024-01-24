import { PreloadedStateShapeFromReducersMapObject, combineReducers, configureStore } from '@reduxjs/toolkit'
import admin from './adminSlice'

// root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  admin
})

export const setupStore = (preloadedState?: PreloadedStateShapeFromReducersMapObject<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
    preloadedState
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
