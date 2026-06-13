"use client";

import { useState, useMemo } from "react";
import CategoryTreeNode from "@/components/CategoryTreeNode";
import { buildTree, getCategoryPath } from "@/lib/category-tree";

export default function CategoryPicker({
  categories,
  value,
  onChange,
  label = "Select Category",
}) {
  const [open, setOpen] = useState(false);

  const tree = useMemo(
    () => buildTree(categories),
    [categories]
  );

  const selectedPath = value
    ? getCategoryPath(categories, value)
    : "Main Category";

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border border-gray-300 rounded-xl p-4 text-left bg-white hover:border-black"
      >
        {selectedPath}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4 text-black">
              <h2 className="text-xl font-bold">
                {label}
              </h2>
              <button onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            {/* Root Option */}
            <div
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="p-3 rounded-xl border cursor-pointer hover:bg-gray-100 mb-3 text-black"
            >
              Main Category
            </div>

            {/* Recursive Category Tree */}
            {tree.map((node) => (
              <CategoryTreeNode
                key={node.id}
                node={node}
                selectedId={value}
                onSelect={(id) => {
                  onChange(id);
                  setOpen(false);
                }}
              />
            ))}

          </div>
        </div>
      )}
    </>
  );
} 