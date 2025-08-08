"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, memo } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import Link from "next/link";

const HamburgerToggle = memo(({ 
  navigationOpen,
  setNavigationOpen 
}: {
  navigationOpen: boolean;
  setNavigationOpen: (value: boolean) => void;
}) => (
  <button
    aria-label="hamburger Toggler"
    className="block xl:hidden"
    onClick={() => setNavigationOpen(!navigationOpen)}
  >
    <span className="relative block h-5.5 w-5.5 cursor-pointer">
      <span className="absolute right-0 block h-full w-full">
        <span
          className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-0 duration-200 ease-in-out dark:bg-white ${
            !navigationOpen ? "!w-full delay-300" : "w-0"
          }`}
        ></span>
        <span
          className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
            !navigationOpen ? "delay-400 !w-full" : "w-0"
          }`}
        ></span>
        <span
          className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
            !navigationOpen ? "!w-full delay-500" : "w-0"
          }`}
        ></span>
      </span>
      <span className="block absolute right-0 h-full w-full rotate-45">
        <span
          className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
            !navigationOpen ? "!h-0 delay-0" : "h-full"
          }`}
        ></span>
        <span
          className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
            !navigationOpen ? "!h-0 delay-200" : "h-0.5"
          }`}
        ></span>
      </span>
    </span>
  </button>
));

HamburgerToggle.displayName = 'HamburgerToggle';

const DropdownIcon = memo(() => (
  <svg
    className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
  </svg>
));

DropdownIcon.displayName = 'DropdownIcon';

const NavItem = memo(({ 
  item, 
  pathUrl, 
  dropdownToggler, 
  setDropdownToggler 
}: {
  item: any;
  pathUrl: string;
  dropdownToggler: boolean;
  setDropdownToggler: (value: boolean) => void;
}) => {
  if (item.submenu) {
    return (
      <>
        <button
          onClick={() => setDropdownToggler(!dropdownToggler)}
          className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
        >
          {item.title}
          <span>
            <DropdownIcon />
          </span>
        </button>
        <ul className={`dropdown ${dropdownToggler ? "flex" : ""}`}>
          {item.submenu.map((subItem: any, key: number) => (
            <li key={key} className="hover:text-primary">
              <Link href={subItem.path || "#"}>{subItem.title}</Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <Link
      href={`${item.path}`}
      className={`flex py-2 text-base font-medium text-body-color duration-300 ease-in-out hover:text-primary dark:text-body-color-dark dark:hover:text-primary ${
        pathUrl === `${item.path}` && "!text-primary"
      }`}
    >
      {item.title}
    </Link>
  );
});

NavItem.displayName = 'NavItem';

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const pathUrl = usePathname();
  const isEmployer = pathUrl.startsWith("/employer");

  const handleStickyMenu = useCallback(() => {
    setStickyMenu(window.scrollY >= 80);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, [handleStickyMenu]);

  const headerClasses = `fixed left-0 top-0 z-99999 w-full py-7 ${
    stickyMenu
      ? "bg-white !py-4 shadow-sm transition duration-100 dark:bg-black"
      : ""
  }`;

  const navMenuClasses = `invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${
    navigationOpen &&
    "navbar !visible mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
  }`;

  return (
    <header className={headerClasses}>
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <HamburgerToggle 
            navigationOpen={navigationOpen} 
            setNavigationOpen={setNavigationOpen} 
          />
        </div>

        <div className={navMenuClasses}>
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {menuData.map((menuItem, key) => (
                <li key={key} className={menuItem.submenu && "group relative"}>
                  <NavItem
                    item={menuItem}
                    pathUrl={pathUrl}
                    dropdownToggler={dropdownToggler}
                    setDropdownToggler={setDropdownToggler}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6 2xsm:gap-8">
            <ThemeToggler />

            <div className="flex items-center gap-5 2xsm:gap-6">
              <Link
                href={isEmployer ? "/" : "/employer"}
                className="ease-in-up hidden text-base font-medium text-black transition duration-300 hover:text-primary dark:text-white dark:hover:text-primary lg:block"
              >
                {isEmployer ? "For Student" : "For Employer"}
              </Link>
              <Link
                href="/auth/signin"
                className="ease-in-up hidden rounded-full bg-primary py-3 px-8 text-base font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp lg:block lg:px-6 xl:px-8"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;