"use client";
import React from "react";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";

export function ResponseViewer({ response }) {
  return (
    // ✨ Updated main container background and border
    <section className="flex-1 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 overflow-hidden flex flex-col">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        {/* ✨ Updated header text color to match theme */}
        <h2 className="text-xl font-bold text-green-400">API Response</h2>

        {response && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              // Color logic remains the same (red for error, green for success)
              response.status >= 400 || response.status === 0
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {response.status} {response.statusText} • {response.duration} ms
          </span>
        )}
      </div>

      {/* ---------- RESPONSE BODY ---------- */}
      {response ? (
        // ✨ Updated JSON Viewer background
        <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-auto border border-gray-700">
          <JsonView
            value={response.body || { error: response.error }}
            // Keep darkTheme for the JSON syntax highlighting
            style={darkTheme}
            collapsed={1}
            enableClipboard={false}
            displayDataTypes={false}
          />
        </div>
      ) : (
        // ✨ Updated placeholder text style
        <div className="flex-1 flex items-center justify-center text-gray-400 text-base border border-dashed border-gray-700 rounded-lg">
          Response will appear here after clicking{" "}
          <b className="mx-1 text-green-400 font-bold">Send</b>
        </div>
      )}
    </section>
  );
}
