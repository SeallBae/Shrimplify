import React, { useState } from "react";
import ShrimpButton from "../base/ShrimpButton";
import SetStatRange from "../form/SetStatRange";

export interface Props {
  user: any;
}

export default function Setting({ user }: Props) {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);

  return (
    <>
      <div className="setting-container">
        <ShrimpButton title={"set stat"} onClick={() => setIsOpenForm(true)} />
      </div>
      {isOpenForm && (
        <SetStatRange user={user} open={isOpenForm} setOpen={setIsOpenForm} />
      )}
    </>
  );
}
