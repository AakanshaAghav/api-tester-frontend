"use client";
import React from "react";

export function KeyValueEditor({ data, setData }) {
  // ✅ FIX: Define the function here
  const handleKeyValueChange = (index, field, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addRow = () => {
    setData((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), key: "", value: "" },
    ]);
  };

  const removeRow = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <input
            value={item.key}
            onChange={(e) => handleKeyValueChange(index, "key", e.target.value)}
            placeholder="Key"
            className="w-5/12 p-1 border border-gray-300 rounded-md text-sm"
          />

          <input
            value={item.value}
            onChange={(e) =>
              handleKeyValueChange(index, "value", e.target.value)
            }
            placeholder="Value"
            className="w-6/12 p-1 border border-gray-300 rounded-md text-sm"
          />

          <button
            onClick={() => removeRow(index)}
            className="text-red-600 font-bold px-2"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addRow}
        className="text-indigo-600 text-sm font-semibold"
      >
        + Add Row
      </button>
    </div>
  );
}
