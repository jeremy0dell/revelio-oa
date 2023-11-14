import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
  const location = useLocation();

  // scrolls to top whenever pathname changes
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }, [location]);
};

export default useScrollToTop;
