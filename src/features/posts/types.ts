
export interface Story {
    id: number;
    title: string;
    url?: string;
    by: string;
    score: number;
    time: number;
    descendants: number;
}

export interface PostsState {
    posts: Story[];
    starred: number[]; // Story ids
    hasNextPage: boolean;
    loading: boolean;
    error: string | null;
}
