import React from "react";

export interface Props {
  user: any;
}

export default function Header({ user }: Props) {
  return (
    <div className="header">
      <div className="header__welcome">Welcome {user?.name}!</div>
    </div>
  );
}
