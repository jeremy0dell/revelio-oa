import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useCheckRoute = (page: number) => {
    const navigate = useNavigate();

    useEffect(() => {
      // check if the page param is a number
      if (isNaN(Number(page))) {
        // if not, go to 404 page
        navigate('/404', { replace: true });
      }
    }, [page, navigate]);
  
}

export default useCheckRoute