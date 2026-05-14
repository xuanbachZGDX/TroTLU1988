import React from "react";

const ListSelector = ({ name, defaultText, queries, content, handleSubmit }) => {
  return (
    <div className="p-4 flex flex-col">
      <span className="py-2 flex gap-2 items-center border-b border-gray-200">
        <input
          type="radio"
          name={name}
          id="default"
          value={defaultText || ""}
          checked={!queries[`${name}Code`] ? true : false}
          onChange={(e) =>
            handleSubmit(e, {
              [name]: defaultText,
              [`${name}Code`]: null,
            })
          }
        />
        <label htmlFor="default">{defaultText}</label>
      </span>
      {content?.map((item) => {
        return (
          <span
            key={item.code}
            className="py-2 flex gap-2 items-center border-b border-gray-200"
          >
            <input
              type="radio"
              name={name}
              id={item.code}
              value={item.code}
              checked={
                item.code === queries[`${name}Code`] ? true : false
              }
              onChange={(e) =>
                handleSubmit(e, {
                  [name]: item.value,
                  [`${name}Code`]: item.code,
                })
              }
            />
            <label htmlFor={item.code}>{item.value}</label>
          </span>
        );
      })}
    </div>
  );
};

export default ListSelector;
