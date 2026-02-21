'use client';

import { useState } from 'react';

type UserMenuProps = {
  onLogout: () => void;
};

export default function UserMenu({ onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[1050]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="user-menu-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Account menu"
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 bg-surface border border-border rounded-2xl shadow-xl py-3 px-4 min-w-[160px]">
          <p className="text-xs text-text-tertiary mb-2">Account</p>
          <button
            type="button"
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
