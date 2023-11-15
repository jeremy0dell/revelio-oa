import React from "react";
import { useNavigate } from "react-router-dom";
import useIsStarredPage from "../../hooks/useIsStarredPage";

export enum NavType {
  SHOW_MORE = "SHOW_MORE",
  GO_BACK = "GO_BACK",
}

interface NavButtonProps {
  navType: NavType;
  currentPage: number;
}

const NavButton: React.FC<NavButtonProps> = ({ navType, currentPage }) => {
  const isStarred = useIsStarredPage();
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (navType === NavType.SHOW_MORE) {
      navigate(
        isStarred ? `/starred/${currentPage + 1}` : `/${currentPage + 1}`
      );
    } else if (navType === NavType.GO_BACK) {
      navigate(-1);
    }
  };

  const buttonLabel = navType === NavType.SHOW_MORE ? "Show More" : "Go Back";

  return (
    <button
      className="px-6 py-2 font-semibold text-white transition duration-300 ease-in-out transform bg-orange-500 rounded-full hover:-translate-y-1"
      onClick={handleNavigation}
    >
      {buttonLabel}
    </button>
  );
};

export default NavButton;
