import React from "react";
import { toggleStar } from "../../features/posts/postsSlice";
import { formatDistanceToNow } from "date-fns";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Story } from "../../features/posts/types";

interface PostProps {
  post: Story;
  number: number;
}

const Post: React.FC<PostProps> = ({ post, number }) => {
  const dispatch = useDispatch();

  const timeAgo = formatDistanceToNow(new Date(post.time * 1000), {
    addSuffix: true,
  });

  let titleElement;
  let hostnameElement;

  if (post.url) {
    try {
      const url = new URL(post.url);
      const hostname = url.hostname.replace(/^www\./, "");
      titleElement = (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-md lg:text-lg hover:underline"
        >
          {post.title}
        </a>
      );
      hostnameElement = (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-normal text-black text-opacity-50 dark:text-white dark:text-opacity-50 hover:underline"
        >
          ({hostname})
        </a>
      );
    } catch (error) {
      console.error("Error parsing URL:", error);
      titleElement = (
        <span className="font-bold text-md lg:text-lg">{post.title}</span>
      );
    }
  } else {
    titleElement = (
      <span className="font-bold text-md lg:text-lg">{post.title}</span>
    );
  }

  const savedPosts = useSelector((state: RootState) => state.posts.starred);
  const isSaved = savedPosts.includes(post.id);

  const handleSaveClick = () => {
    dispatch(toggleStar(post.id));
  };

  return (
    <article className="flex flex-row items-start gap-0 sm:gap-4">
      <span className="font-mono font-normal text-md lg:text-lg">
        {number}.
      </span>
      <div className="flex flex-col flex-grow">
        <h2 className="mb-1 font-mono">
          {titleElement} {hostnameElement}
        </h2>
        <div className="flex items-center font-sans text-xs text-black text-opacity-50 dark:text-white dark:text-opacity-50">
          {post.score} points by {post.by} {timeAgo} | {post.descendants}{" "}
          comments <span className="hidden sm:block sm:ml-1">| </span>
          <button
            onClick={handleSaveClick}
            className="flex items-center text-black text-opacity-50 dark:text-white dark:text-opacity-50 hover:underline focus:outline-none"
            aria-label={isSaved ? "Unsave story" : "Save story"}
          >
            {isSaved ? (
              <IoStarSharp className="mx-1 text-orange-500" />
            ) : (
              <IoStarOutline className="mx-1" />
            )}
            <span className="hidden sm:block">
              {isSaved ? "saved" : "save"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export const LoadingPost = () => (
  <article className="flex flex-row items-start gap-4 animate-pulse">
    <div className="w-6 h-6 font-mono font-normal rounded-full text-md lg:text-lg bg-slate-200"></div>
    <div className="flex flex-col flex-grow">
      <div className="w-3/4 h-4 mb-1 rounded bg-slate-200"></div>{" "}
      <div className="w-1/4 h-4 mb-3 rounded bg-slate-200"></div>{" "}
      <div className="flex items-center font-sans text-xs">
        <div className="w-16 h-4 mr-2 rounded bg-slate-200"></div>{" "}
        <div className="w-24 h-4 mr-2 rounded bg-slate-200"></div>{" "}
        <div className="w-16 h-4 mr-2 rounded bg-slate-200"></div>{" "}
        <div className="w-16 h-4 mr-2 rounded bg-slate-200"></div>{" "}
        <div className="w-10 h-4 rounded bg-slate-200"></div>{" "}
      </div>
    </div>
  </article>
);

export default Post;
