import { configureStore } from '@reduxjs/toolkit'
import formSlice from './slice/formSlice'
// ...

export const store = configureStore({
  reducer: {
    form: formSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch