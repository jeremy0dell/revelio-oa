import { useLocation } from "react-router-dom";

 const useIsStarredPage = () => {
    const location = useLocation();
    return location.pathname.startsWith("/starred");
  };

  export default useIsStarredPage