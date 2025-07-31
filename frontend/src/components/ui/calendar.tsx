'use client';

import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function Calendar(props: DayPickerProps) {
  return (
    <div className="rounded-md p-2">
      <DayPicker
        classNames={{
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          nav: 'space-x-1 flex items-center',
          nav_button: 'bg-transparent hover:bg-gray-100 p-1 rounded',
          table: 'w-full border-collapse',
          head_row: 'flex',
          head_cell: 'text-gray-500 w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'text-center w-9 h-9 text-sm p-0 relative',
          day: 'h-9 w-9 p-0 font-normal',
          day_selected: 'bg-blue-500 text-white hover:bg-blue-600',
          day_today: 'border border-blue-400',
        }}
        disabled={{ before: new Date() }}
        {...props}
      />
    </div>
  );
}
