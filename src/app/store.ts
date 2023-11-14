import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        settings: settingsReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch