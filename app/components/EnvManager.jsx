"use client";
import { useState, useEffect } from "react";

export function EnvManager({ activeEnv, setActiveEnv, envs, setEnvs }) {
  
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("api_envs");
    if (saved) setEnvs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("api_envs", JSON.stringify(envs));
  }, [envs]);

  const addVariable = () => {
    if (!keyName) return;
    setEnvs((prev) => ({
      ...prev,
      [activeEnv]: { ...prev[activeEnv], [keyName]: keyValue },
    }));
    setKeyName("");
    setKeyValue("");
  };

  const deleteVar = (k) => {
    const copy = { ...envs[activeEnv] };
    delete copy[k];
    setEnvs((prev) => ({ ...prev, [activeEnv]: copy }));
  };

  return (
    // ✨ COMPACT CHANGE: Reduced vertical padding (py-2) and spacing (space-y-2)
    <div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 shadow-xl space-y-2 shrink-0">
      {/* COMPACT CHANGE: Reduced margin-bottom (mb-1) on header */}
      <h3 className="text-lg font-bold text-gray-100 mb-1 border-b border-gray-700 pb-1">
        Environments
      </h3>

      {/* ENV TABS */}
      <div className="flex gap-2">
        {["dev", "staging", "prod"].map((env) => (
          <button
            key={env}
            onClick={() => setActiveEnv(env)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition duration-150 ${
              // ✨ Dark mode active and inactive button styles
              activeEnv === env
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {env.toUpperCase()}
          </button>
        ))}
      </div>

      {/* KEY VALUE INPUT  */}
      <div className="flex gap-2">
        <input
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="KEY"
          // ✨ Dark mode input styles
          className="border border-gray-600 px-3 py-1 rounded-lg w-1/3 text-sm bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition"
        />
        <input
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder="VALUE"
          // ✨ Dark mode input styles
          className="border border-gray-600 px-3 py-1 rounded-lg w-1/2 text-sm bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition"
        />
        <button
          onClick={addVariable}
          // ✨ Dark mode Add button style
          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md transition duration-150"
        >
          Add
        </button>
      </div>

      {/* VARIABLE LIST (Max height remains small to ensure space saving) */}
      <div className="text-xs space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
        {Object.entries(envs[activeEnv] || {}).map(([k, v]) => (
          <div
            key={k}
            // ✨ Dark mode list item style
            className="flex justify-between items-center bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg border border-gray-600 transition duration-150 text-gray-200"
          >
            <span className="font-mono truncate">
              <span className="text-green-400 font-bold">{`{{${k}}}`}</span> →{" "}
              {v}
            </span>
            <button
              onClick={() => deleteVar(k)}
              // ✨ Dark mode delete button style
              className="text-red-500 hover:text-red-400 font-bold transition duration-150 ml-2"
              title="Delete Variable"
            >
              ✕
            </button>
          </div>
        ))}
        {/* Empty state message for dark mode */}
        {Object.keys(envs[activeEnv] || {}).length === 0 && (
          <div className="text-gray-500 text-center py-2 italic">
            No variables set for {activeEnv.toUpperCase()}.
          </div>
        )}
      </div>
    </div>
  );
}