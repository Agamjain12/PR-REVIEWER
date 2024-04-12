import Link from "next/link";

import UserNav from "@/components/shared/user-nav";
const Navbar = () => {
  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200">
      <nav className="h-16 px-4 flex items-center">
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
