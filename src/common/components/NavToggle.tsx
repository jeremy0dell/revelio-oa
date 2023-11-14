import { Link } from "react-router-dom";
import useIsStarredPage from "../../hooks/useIsStarredPage";

const NavToggle = () => {
  const isStarred = useIsStarredPage();

  return (
    <div className="flex">
      <Link
        className={
          !isStarred
            ? "font-bold text-orange-500 border-b-2 border-transparent"
            : "hover:border-b-2 hover:border-orange-500"
        }
        to="/"
      >
        latest
      </Link>
      <span className="mx-1">|</span>
      <Link
        className={
          isStarred
            ? "font-bold text-orange-500 border-b-2 border-transparent"
            : "hover:border-b-2 hover:border-orange-500"
        }
        to="/starred"
      >
        starred
      </Link>
    </div>
  );
};

export default NavToggle;
