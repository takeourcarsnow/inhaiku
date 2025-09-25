import React from 'react';

type Props = {
  notif: string | null;
};

export default function Notification({ notif }: Props) {
  if (!notif) return null;
  return <div className="notification">{notif}</div>;
}