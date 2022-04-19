import React from "react";

export interface ButtonsGroupData {
  text: string;
  value: any;
}

interface IProps {
  data: ButtonsGroupData[];
  clickHandler: (v: any) => any;
}

export default function ButtonsGroup(props: IProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {props.data.map((x) => (
        <button
          key={x.value}
          onClick={() => props.clickHandler(x.value)}
          type="button"
          className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          {x.text}
        </button>
      ))}
    </div>
  );
}
