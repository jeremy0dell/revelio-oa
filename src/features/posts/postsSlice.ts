import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { loadStarredStories, saveStarredStories } from './localStorageUtils';
import { PostsState, Story } from './types';
import { HACKER_NEWS_API, fetchPosts } from './API';

const initialState: PostsState = {
  posts: [],
  starred: loadStarredStories(), // loaded from localStorage
  hasNextPage: false,
  loading: false,
  error: null,
};

export const fetchStarredPosts = createAsyncThunk<Story[], number, { rejectValue: string, state: RootState, dispatch: Dispatch }>(
  'posts/fetchStarredPosts',
  async (page, { rejectWithValue, getState, dispatch }) => {
    const { posts: { starred } } = getState()
    const list = starred

    return await fetchPosts(page, list, dispatch, rejectWithValue)
  }
)

export const fetchNewestPosts = createAsyncThunk<Story[], number, { rejectValue: string, dispatch: Dispatch }>(
  'posts/fetchNewestPosts',
  async (page, { rejectWithValue, dispatch }) => {
    const { data } = await axios.get<number[]>(`${HACKER_NEWS_API}/newstories.json`);
    const list = data

    return await fetchPosts(page, list, dispatch, rejectWithValue)

  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    showNextPage: (state: PostsState, action: PayloadAction<boolean>) => {
      const shouldShowNext = action.payload
      state.hasNextPage = shouldShowNext
    },
    toggleStar: (state: PostsState, action: PayloadAction<number>) => {
      const storyId = action.payload;
      if (state.starred.includes(storyId)) {
        state.starred = state.starred.filter(id => id !== storyId);
      } else {
        state.starred.unshift(storyId);
      }
      saveStarredStories(state.starred); // save updated array to localStorage
    }
  },
  extraReducers: (builder) => {
    builder
      // new posts
      .addCase(fetchNewestPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewestPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchNewestPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // starred posts
      .addCase(fetchStarredPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStarredPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchStarredPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleStar, showNextPage } = postsSlice.actions;
export default postsSlice.reducer;
