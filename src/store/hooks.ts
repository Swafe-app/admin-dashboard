import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './reducer'

export const useTypeDispatch = useDispatch<AppDispatch>
export const useTypeSelector: TypedUseSelectorHook<RootState> = useSelector
