"use client";

import {
  useState,
} from "react";

export default function CategoryTreeNode({

  node,

  selectedId,

  onSelect,

}) {

  const [
    open,
    setOpen,
  ] = useState(false);

  return (

    <div className="text-black">

      <div
        className={`
          flex
          items-center
          gap-2
          p-3
          rounded-xl
          transition
          hover:bg-gray-100

          ${
            selectedId === node.id

              ? "bg-black text-white"

              : ""
          }
        `}
      >

        {/* Expand Button */}

        {node.children.length > 0 ? (

          <button
            type="button"
            onClick={(e) => {

              e.stopPropagation();

              setOpen(
                !open
              );

            }}
            className="w-6 text-left"
          >

            {open ? "▼" : "▶"}

          </button>

        ) : (

          <span className="w-6">

            📄

          </span>

        )}

        {/* Select Category */}

        <div
          onClick={() =>
            onSelect(
              node.id
            )
          }
          className="flex-1 cursor-pointer"
        >

          {node.title}

        </div>

      </div>

      {open &&
        node.children.length >
          0 && (

          <div className="ml-6 border-l pl-4 mt-2">

            {node.children.map(
              (child) => (

                <CategoryTreeNode
                  key={
                    child.id
                  }
                  node={
                    child
                  }
                  selectedId={
                    selectedId
                  }
                  onSelect={
                    onSelect
                  }
                />

              )
            )}

          </div>

        )}

    </div>

  );

}