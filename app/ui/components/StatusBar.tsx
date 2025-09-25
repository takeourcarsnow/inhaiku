import React from 'react';

type Props = {
  clock: string;
  dateStr: string;
};

export default function StatusBar({ clock, dateStr }: Props) {
  return (
    <div className="status-bar">
      <span>NEWS HAIKU</span>
      <span>{clock}</span>
      <span>{dateStr}</span>
    </div>
  );
}
