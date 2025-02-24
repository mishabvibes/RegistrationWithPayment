import React, { useState } from "react";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownMenuItem = ({
  children,
  onClick,
  className = "",
}: DropdownMenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`${className} block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer`}
      role="menuitem"
    >
      {children}
    </div>
  );
};