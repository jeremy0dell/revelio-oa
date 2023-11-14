import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewestPosts,
  fetchStarredPosts,
} from "../features/posts/postsSlice";
import { AppDispatch, RootState } from "../app/store";
import Post, { LoadingPost } from "../common/components/Post";
import NavButton, { NavType } from "../common/components/NavButton";
import { useParams } from "react-router-dom";
import useCheckRoute from "../hooks/useCheckRoute";
import { pageSize } from "../features/posts/API";

export enum ListPageType {
  NEWEST = "newest",
  STARRED = "starred",
}

interface ListPageProps {
  listPageType: ListPageType;
}

const ListPage: React.FC<ListPageProps> = ({ listPageType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error, hasNextPage } = useSelector(
    (state: RootState) => state.posts
  );

  const { page } = useParams<{ page?: string }>();
  const validPage = page ? parseInt(page, 10) : 1;
  useCheckRoute(validPage);
  const currentPage = validPage;
  const offset = (currentPage - 1) * pageSize;

  // fetch relevant page
  useEffect(() => {
    const currentPage = page ? parseInt(page, 10) : 1;
    if (listPageType === ListPageType.NEWEST) {
      dispatch(fetchNewestPosts(currentPage));
    } else {
      dispatch(fetchStarredPosts(currentPage));
    }
  }, [dispatch, listPageType, page]);

  // ** this shows skeletons on load **
  if (loading)
    return (
      <div className="flex flex-col gap-6">
        {Array(pageSize)
          .fill(1)
          .map((_, i) => (
            <LoadingPost key={i} />
          ))}
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post, index) => (
        <Post key={post.id} post={post} number={offset + index + 1} />
      ))}
      <div className="flex gap-4">
        {currentPage > 1 && (
          <NavButton navType={NavType.GO_BACK} currentPage={currentPage} />
        )}
        {hasNextPage && (
          <NavButton navType={NavType.SHOW_MORE} currentPage={currentPage} />
        )}
      </div>
    </div>
  );
};

export default ListPage;
