import React from "react";
import { X, FolderPlus, Plus } from "lucide-react";

export function CreateCollectionModal({
  newCollectionName,
  setNewCollectionName,
  saveError,
  setIsCreateModalOpen,
  handleCreateCollection,
  loading,
}) {
  return (
    <div
      // Backdrop: Background opacity is good for dark mode
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
      onClick={() => setIsCreateModalOpen(false)}
    >
      <div
        // ✨ Modal content box: Dark background and border
        className="bg-gray-800 p-6 rounded-xl shadow-2xl w-96 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {/* ✨ Header text color */}
          <h3 className="text-xl font-bold text-green-400">New Collection</h3>
          {/* Close button text color */}
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="text-gray-400 hover:text-gray-100 transition"
          >
            <X />
          </button>
        </div>

        <input
          value={newCollectionName || ""}
          onChange={(e) => setNewCollectionName(e.target.value)}
          // ✨ Input field: Dark background, light text, focused green border
          className="w-full p-2 border border-gray-600 rounded-lg mb-4 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Enter collection name"
        />

        {/* Error text color is fine */}
        {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

        <button
          onClick={handleCreateCollection}
          disabled={loading}
          // ✨ Primary button: Dark mode green primary color
          className={`w-full p-2 rounded-lg font-semibold text-white transition duration-150 ${
            loading
              ? "bg-green-700/50 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 active:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create Folder"}
        </button>
      </div>
    </div>
  );
}

export function SaveRequestModal({
  collections = [],
  handleSaveRequest,
  setIsSaveModalOpen,
  setIsCreateModalOpen,
  saveError,
  loading,
}) {
  return (
    <div
      // Backdrop: Background opacity is good for dark mode
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
      onClick={() => setIsSaveModalOpen(false)}
    >
      <div
        // ✨ Modal content box: Dark background and border
        className="bg-gray-800 p-6 rounded-xl shadow-2xl w-96 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✨ Header text color */}
        <h3 className="text-xl font-bold text-green-400 mb-4">Save Request</h3>

        {/* Error text color is fine */}
        {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

        {/* ✨ 'No collections' text color */}
        {collections.length === 0 && (
          <p className="text-gray-400 text-sm mb-4">No collections available</p>
        )}

        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => handleSaveRequest(col.id)}
            disabled={loading}
            // ✨ Collection buttons: Dark background, light text, and border
            className={`w-full text-left p-3 border border-gray-600 rounded-lg mb-2 truncate bg-gray-700 text-gray-100 hover:bg-gray-600 transition duration-150 flex items-center ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <FolderPlus className="inline-block w-4 h-4 mr-2 text-green-400" />
            {typeof col.name === "string" ? col.name : "Unnamed Collection"} (
            {typeof col.item_count === "number" ? col.item_count : 0})
          </button>
        ))}

        <button
          onClick={() => {
            setIsSaveModalOpen(false);
            setIsCreateModalOpen(true);
          }}
          // ✨ Secondary action button: Outline green, dark hover
          className="w-full mt-4 p-2 text-green-400 border border-green-600 rounded-lg flex items-center justify-center hover:bg-green-900/40 transition duration-150"
        >
          <Plus className="inline-block w-4 h-4 mr-1" />
          Create New Collection
        </button>
      </div>
    </div>
  );
}
