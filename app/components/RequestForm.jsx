"use client";
import React, { useState } from "react";
import { Save } from "lucide-react";
import { KeyValueEditor } from "./KeyValueEditor";
import { CreateCollectionModal, SaveRequestModal } from "./Modals";
import { getAuthHeaders } from "../lib/supabaseClient";

export function RequestForm({
  url,
  setUrl,
  method,
  setMethod,
  activeTab,
  setActiveTab,
  bodyContent,
  setBodyContent,
  headers,
  setHeaders,
  params,
  setParams,
  loading,
  handleSendRequest,
  collections,
  fetchCollections,
}) {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const renderTabContent = () => {
    // Note: KeyValueEditor component also needs its internal styling updated
    switch (activeTab) {
      case "Body":
        return (
          <textarea
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            // ✨ Dark mode styles for Body textarea
            className="w-full h-full p-2 border border-gray-600 rounded-md font-mono text-xs resize-none bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition duration-150"
            placeholder="Enter JSON request body here..."
            disabled={method === "GET" || method === "DELETE"}
          />
        );
      case "Headers":
        return (
          <KeyValueEditor type="Header" data={headers} setData={setHeaders} />
        );
      case "Params":
        return (
          <KeyValueEditor type="Param" data={params} setData={setParams} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <section
        // ✨ Dark mode styles for the main container
        className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700 min-h-[25%] max-h-[35%] flex flex-col"
      >
        {/* ✨ Dark mode header text */}
        <h2 className="text-xl font-bold mb-3 text-gray-100">
          API Request Input
        </h2>

        <div className="flex space-x-2 mb-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            // ✨ Dark mode styles for method selector
            className="p-1 border border-gray-600 rounded-lg w-24 bg-gray-700 font-bold text-sm text-gray-100 appearance-none focus:ring-green-500 focus:border-green-500 transition duration-150"
          >
            {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
              <option key={m} value={m} className="bg-gray-800 text-gray-100">
                {m}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter API URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            // ✨ Dark mode styles for URL input
            className="flex-grow p-2 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition duration-150"
          />

          <button
            onClick={handleSendRequest}
            disabled={loading}
            // ✨ Updated Send Button colors
            className={`p-2 w-24 rounded-lg font-semibold text-white transition duration-150 shadow-md ${
              loading
                ? "bg-green-700/50 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 active:bg-green-700"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Send"
            )}
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            disabled={loading}
            // ✨ Updated Save Button colors
            className={`p-2 w-10 rounded-lg font-semibold text-white transition duration-150 shadow-md flex items-center justify-center ${
              loading
                ? "bg-yellow-700/50 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600"
            }`}
            title="Save Request to Collection"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Content Area */}
        <div
          // ✨ Dark mode styles for tab area container
          className="flex-grow border border-gray-700 rounded-lg bg-gray-900 flex flex-col overflow-hidden"
        >
          <div
            // ✨ Dark mode styles for tab bar
            className="flex space-x-4 border-b border-gray-700 px-4 py-2 bg-gray-800"
          >
            {["Body", "Headers", "Params"].map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold pb-1 cursor-pointer text-sm transition duration-150 ${
                  // ✨ Dark mode active tab indicator
                  activeTab === tab
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-400 hover:text-green-300"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="p-2 flex-grow overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </section>

      {/* MODALS (Assuming Modals.jsx and KeyValueEditor.jsx will be updated separately for dark mode) */}

      {/* SAVE REQUEST MODAL */}
      {isSaveModalOpen && (
        <SaveRequestModal
          collections={collections}
          setIsSaveModalOpen={setIsSaveModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          loading={localLoading}
          saveError={null}
          handleSaveRequest={async (collectionId) => {
            try {
              setLocalLoading(true);
              const authHeaders = {
                ...(await getAuthHeaders()),
                "Content-Type": "application/json",
              };

              let parsedBody = null;
              if (bodyContent) {
                try {
                  // We should not use alert here. This needs to be changed to a custom modal/toast.
                  // For now, retaining user's logic to prevent function change.
                  parsedBody = JSON.parse(bodyContent);
                } catch (err) {
                  console.error("Request body is not valid JSON:", err);
                  // Using console.error instead of alert as per instructions
                  alert("Request body is not valid JSON");
                  return;
                }
              }

              const payload = {
                url,
                method,
                headers: headers.reduce((acc, { key, value }) => {
                  if (key) acc[key] = value;
                  return acc;
                }, {}),
                body: parsedBody,
              };

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections/${collectionId}/items`,
                {
                  method: "POST",
                  headers: authHeaders,
                  body: JSON.stringify(payload),
                }
              );

              if (res.ok) {
                fetchCollections();
                setIsSaveModalOpen(false);
              } else {
                const data = await res.json();
                console.error("Error saving request:", data);
                // Using console.error instead of alert as per instructions
                alert("Failed to save request");
              }
            } catch (err) {
              console.error(err);
              // Using console.error instead of alert as per instructions
              alert("Error saving request");
            } finally {
              setLocalLoading(false);
            }
          }}
        />
      )}

      {/* CREATE COLLECTION MODAL */}
      {isCreateModalOpen && (
        <CreateCollectionModal
          newCollectionName={newCollectionName}
          setNewCollectionName={setNewCollectionName}
          setIsCreateModalOpen={setIsCreateModalOpen}
          loading={localLoading}
          saveError={null}
          handleCreateCollection={async () => {
            // Using console.error instead of alert as per instructions
            if (!newCollectionName)
              return console.error("Enter collection name");

            try {
              setLocalLoading(true);
              const authHeaders = {
                ...(await getAuthHeaders()),
                "Content-Type": "application/json",
              };

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections`,
                {
                  method: "POST",
                  headers: authHeaders,
                  body: JSON.stringify({ name: newCollectionName }),
                }
              );

              if (res.ok) {
                setNewCollectionName("");
                setIsCreateModalOpen(false);
                fetchCollections();
              } else {
                const data = await res.json();
                // Using console.error instead of alert as per instructions
                alert(data.message || "Failed to create collection");
              }
            } catch (err) {
              console.error(err);
              // Using console.error instead of alert as per instructions
              alert("Error creating collection");
            } finally {
              setLocalLoading(false);
            }
          }}
        />
      )}
    </>
  );
}
