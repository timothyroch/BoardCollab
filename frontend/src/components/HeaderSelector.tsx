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
    <div className="flex mb-4 border-white/30 pb-2">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={cn(
            'flex-1 text-sm font-medium px-4 py-2 transition-all duration-300',
            activeTab === key
              ? 'text-white border-b-2 border-white'
              : 'text-white/60 hover:text-white hover:bg-white/10',
            'relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5',
            'before:bg-white before:opacity-0 before:transition-opacity before:duration-300',
            'hover:before:opacity-100'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
