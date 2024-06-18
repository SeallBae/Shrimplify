import React from "react";

export interface Props {
  title: string;
  icon: any;
  nav: string;
  isActive: boolean;
  onClick?: any;
}

export default function MenuItem({
  title,
  icon,
  onClick,
  isActive,
  nav,
}: Props) {
  const active = isActive ? "actived" : "";

  return (
    <div className={`navigation-item ${active}`} onClick={onClick}>
      <div className="icon">{icon}</div>
      {title}
    </div>
  );
}
