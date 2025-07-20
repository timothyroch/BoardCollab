'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface HeaderSelectorProps {
  activeTab: 'general' | 'my-space' | 'group';
  onTabChange: (tab: 'general' | 'my-space' | 'group') => void;
}

export default function HeaderSelector({ activeTab, onTabChange }: HeaderSelectorProps) {
  const tabs: { key: 'general' | 'my-space' | 'group'; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'my-space', label: 'My Space' },
    { key: 'group', label: 'Group' },
  ];

  return (
    <div className="flex space-x-4 mb-6 border-b pb-2">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={cn(
            'text-sm font-medium px-4 py-2 rounded-t',
            activeTab === key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
