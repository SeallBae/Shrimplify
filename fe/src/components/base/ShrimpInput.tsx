import React from "react";

export interface Props {
  title: string;
  require: boolean;
  value?: string | number;
  onInput: any;
}

export default function ShrimpInput({ title, require, value, onInput }: Props) {
  return (
    <div className="shrimpInput">
      {title && <div className="input__title">{title}</div>}
      <input
        type="text"
        value={value}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          onInput(e.target.value)
        }
      />
    </div>
  );
}
