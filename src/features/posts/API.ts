import axios from 'axios';
import { Story } from './types';
import { showNextPage } from './postsSlice';
import { Dispatch } from '@reduxjs/toolkit';

export const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
export const pageSize = 12;

export const fetchStoryById = async (id: number): Promise<Story | undefined> => {
  try {
    const res = await axios.get<Story>(`${HACKER_NEWS_API}/item/${id}.json`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return undefined;
  }
};


export const fetchPosts = async (page: number, list: number[], dispatch: Dispatch, reject: (value: string) => any) => {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
  
      const storyIds = list.slice(startIndex, endIndex);
  
      // handle show buttons
      const restIds = list.slice(endIndex)
      dispatch(showNextPage(!!restIds.length))
      
      const stories = await Promise.all(
        storyIds.map(fetchStoryById)
      );
  
      const validPosts = stories.filter((post) => post !== null && post !== undefined) as Story[];
      return validPosts;
    } catch (error: any) {
      return reject(error.message);
    }
  }