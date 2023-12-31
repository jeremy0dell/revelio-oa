import React from "react";
import logoLight from "../../assets/logo-light.svg";
import logoDark from "../../assets/logo-dark.svg";
import { IoSunny, IoMoonSharp } from "react-icons/io5";
import NavToggle from "./NavToggle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setDarkMode } from "../../features/settings/settingsSlice";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch();
  const darkModeEnabled = useSelector(
    (state: RootState) => state.settings.darkModeEnabled
  );

  const logo = darkModeEnabled ? logoDark : logoLight;
  const setDark = () => dispatch(setDarkMode(true));
  const setLight = () => dispatch(setDarkMode(false));

  return (
    <header>
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {" "}
          <img src={logo} alt="Hacker News Logo" className="mr-4" />
          <NavToggle />
        </div>
        <div className="flex items-center">
          {" "}
          {darkModeEnabled ? (
            <button
              aria-label="Activate light mode"
              className="p-2"
              onClick={setLight}
            >
              <IoSunny className="text-yellow-500" />
            </button>
          ) : (
            <button
              aria-label="Activate dark mode"
              className="p-2"
              onClick={setDark}
            >
              <IoMoonSharp className="text-black" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
