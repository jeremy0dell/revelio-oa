import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import ListPage, { ListPageType } from "./pages/ListPage";
import Header from "./common/components/Header";
import Footer from "./common/components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { useEffect, useRef } from "react";
import useScrollToTop from "./hooks/useScrollToTop";

const App = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  useScrollToTop(mainRef);
  const dispatch = useDispatch();
  const darkModeEnabled = useSelector(
    (state: RootState) => state.settings.darkModeEnabled
  );

  useEffect(() => {
    const className = "dark";
    if (darkModeEnabled) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }
  }, [darkModeEnabled, dispatch]);

  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen px-0 md:px-4 lg:px-8 dark:text-white dark:bg-[#1e2025]">
      <Header />
      <main ref={mainRef} className="flex-1 px-4 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={<ListPage listPageType={ListPageType.NEWEST} />}
          />
          <Route
            path="/:page"
            element={<ListPage listPageType={ListPageType.NEWEST} />}
          />
          <Route
            path="/starred"
            element={<ListPage listPageType={ListPageType.STARRED} />}
          />
          <Route
            path="/starred/:page"
            element={<ListPage listPageType={ListPageType.STARRED} />}
          />

          <Route
            path="/404"
            element={<NotFoundPage onNavigateHome={navigateHome} />}
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
