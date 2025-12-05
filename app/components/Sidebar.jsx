import React from "react";
import { ChevronDown, ChevronRight, LogOut, Code } from "lucide-react"; // Added LogOut and Code icons
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export function Sidebar({
  collections,
  activeCollectionId,
  collectionItems,
  selectedHistoryId,
  historyList,
  handleCollectionToggle,
  loadItemDetails,
}) {
  const router = useRouter();

  // ✅ FIXED LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/");
  };

  return (
    // ✨ Dark Sidebar Container
    <aside className="w-64 bg-gray-800 border-r border-gray-700 shadow-xl flex flex-col p-4 transition-colors duration-200">
      {/* Header and Logout Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
          <Code className="h-6 w-6" /> Explorer
        </h2>
        <button
          onClick={handleLogout}
          // ✨ Dark theme red button
          className="bg-red-700 hover:bg-red-600 text-gray-100 px-3 py-1 rounded text-sm flex items-center gap-1 transition duration-150"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* ================= COLLECTIONS ================= */}
      <section className="mb-6">
        <div className="flex justify-between items-center border-b border-gray-700 pb-1 mb-2">
          <h3 className="text-lg font-semibold text-gray-100">Collections</h3>
        </div>

        <div className="text-sm space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
          {collections.map((col) => {
            const isExpanded = activeCollectionId === col.id;

            return (
              <div key={col.id}>
                <div
                  onClick={() => handleCollectionToggle(col.id)}
                  // ✨ Dark collection item style
                  className="text-gray-300 hover:text-green-400 cursor-pointer p-1 rounded-md hover:bg-gray-700 flex justify-between items-center transition duration-150"
                >
                  <span className="flex items-center space-x-1">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                    <span>{col.name}</span>
                  </span>

                  {/* ✨ Dark badge style */}
                  <span className="text-xs font-mono text-gray-300 bg-gray-700 px-2 py-0.5 rounded-full">
                    {col.item_count}
                  </span>
                </div>

                {isExpanded && (
                  <div className="ml-4 border-l border-gray-600 pl-2 space-y-1">
                    {collectionItems.length > 0 ? (
                      collectionItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => loadItemDetails(item.id, "collection")}
                          // ✨ Dark collection item style
                          className={`p-1 rounded-md cursor-pointer hover:bg-gray-700 transition text-xs flex items-center ${
                            selectedHistoryId === item.id
                              ? "bg-green-900/40 font-semibold text-gray-100 border-l-2 border-green-500"
                              : "text-gray-300"
                          }`}
                        >
                          <span
                            // ✨ Dark method color contrast
                            className={`font-mono text-xs mr-1 ${
                              item.method === "GET"
                                ? "text-green-400"
                                : item.method === "POST"
                                ? "text-blue-400"
                                : item.method === "DELETE"
                                ? "text-red-400"
                                : "text-yellow-400"
                            } font-bold w-12`}
                          >
                            {item.method}
                          </span>

                          <span className="truncate flex-grow">{item.url}</span>
                        </div>
                      ))
                    ) : (
                      // ✨ Dark empty state text
                      <div className="text-gray-500 text-xs py-1">
                        {col.item_count > 0
                          ? "Loading items..."
                          : "Folder is empty."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HISTORY ================= */}
      <section className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        <h3 className="text-lg font-semibold border-b border-gray-700 pb-1 mb-2 text-gray-100">
          History (Last 10)
        </h3>

        <div className="text-sm space-y-2">
          {historyList.map((item) => (
            <div
              key={item.id}
              onClick={() => loadItemDetails(item.id, "history")}
              // ✨ Dark history item style
              className={`p-2 rounded-md border-l-4 cursor-pointer transition ${
                selectedHistoryId === item.id
                  ? "bg-green-900/40 border-green-500 text-gray-100" // Selected state with green accent
                  : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span
                // ✨ Dark method color contrast
                className={`font-mono text-xs ${
                  item.method === "GET"
                    ? "text-green-400"
                    : item.method === "POST"
                    ? "text-blue-400"
                    : item.method === "DELETE"
                    ? "text-red-400"
                    : "text-yellow-400"
                } font-bold`}
              >
                {item.method}
              </span>
              <span className="truncate block text-xs">{item.url}</span>
              {/* ✨ Dark metadata text */}
              <span className="text-xs text-gray-400 block">
                Status: {item.response_status || "-"} |{" "}
                {new Date(item.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
