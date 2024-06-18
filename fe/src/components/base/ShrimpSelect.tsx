import React from "react";

export interface Props {
  items?: any;
  value?: string;
  onChange: any;
  title?: string;
}

export default function ShrimpSelect({ value, onChange, title, items }: Props) {
  return (
    <div className="shrimpSelect">
      {title && <>Pick your favorite flavor:</>}
      <select value={value} onChange={(e) => onChange(e)}>
        {items?.map((item: any) => {
          return (
            <option key={item?.id} value={item?.id}>
              {item?.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
