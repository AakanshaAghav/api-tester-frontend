"use client";
import React, { useState, useCallback, useEffect } from "react";
// Assuming these components are provided separately and will be styled for dark mode
import { Sidebar } from "./components/Sidebar";
import { RequestForm } from "./components/RequestForm";
import { ResponseViewer } from "./components/ResponseViewer";
import { EnvManager } from "./components/EnvManager";
import { supabase } from "./lib/supabaseClient";

const initialKeyValue = [{ id: Date.now(), key: "", value: "" }];

// ✅ Function to get current Supabase auth token (Logic unchanged)
const getAuthHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Utility: Apply environment variables (Logic unchanged)
const applyEnvironment = (text, env) => {
  if (!text) return text;
  let result = text;
  Object.entries(env).forEach(([key, val]) => {
    result = result.replaceAll(`{{${key}}}`, val);
  });
  return result;
};

export default function ApiTester() {
  const [userId, setUserId] = useState(null);

  // ✅ Get logged-in user (Logic unchanged)
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  // ✅ API request states (Logic unchanged)
  const [url, setUrl] = useState("{{BASE_URL}}/posts/1");
  const [method, setMethod] = useState("GET");
  const [activeTab, setActiveTab] = useState("Body");
  const [bodyContent, setBodyContent] = useState("");
  const [headers, setHeaders] = useState(initialKeyValue);
  const [params, setParams] = useState(initialKeyValue);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ History & collections (Logic unchanged)
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [collections, setCollections] = useState([]);
  const [collectionItems, setCollectionItems] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ✅ Environment system state (Logic unchanged)
  const [activeEnv, setActiveEnv] = useState("dev");
  const [envs, setEnvs] = useState({
    dev: { BASE_URL: "https://jsonplaceholder.typicode.com" },
    staging: {},
    prod: {},
  });

  // ✅ Load item details (Logic unchanged)
  const loadItemDetails = (item) => {
    if (!item) return;
    setSelectedHistoryId(item.id || null);
    setUrl(item.url || "");
    setMethod(item.method || "GET");

    if (item.request_body) {
      setBodyContent(
        typeof item.request_body === "object"
          ? JSON.stringify(item.request_body, null, 2)
          : item.request_body
      );
    } else {
      setBodyContent("");
    }

    const headersArray =
      item.request_headers && typeof item.request_headers === "object"
        ? Object.entries(item.request_headers).map(([key, value]) => ({
          id: Date.now() + Math.random(),
          key,
          value,
        }))
        : [{ id: Date.now(), key: "", value: "" }];
    setHeaders(headersArray);

    const paramsArray =
      item.request_params && typeof item.request_params === "object"
        ? Object.entries(item.request_params).map(([key, value]) => ({
          id: Date.now() + Math.random(),
          key,
          value,
        }))
        : [{ id: Date.now(), key: "", value: "" }];
    setParams(paramsArray);

    if (item.response_body) {
      setResponse(
        typeof item.response_body === "object"
          ? JSON.stringify(item.response_body, null, 2)
          : item.response_body
      );
    } else {
      setResponse(null);
    }
  };

  // ✅ Fetch history (Logic unchanged)
  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/history`, { headers: authHeaders });
    const data = await res.json();
    if (res.ok) setHistoryList(data);
  }, [BACKEND_URL, userId]);

  // ✅ Fetch collections (Logic unchanged)
  const fetchCollections = useCallback(async () => {
    if (!userId) return;
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/collections`, { headers: authHeaders });
    const data = await res.json();
    if (res.ok) setCollections(data);
  }, [BACKEND_URL, userId]);

  // ✅ Fetch collection items (Logic unchanged)
  const fetchCollectionItems = useCallback(
    async (collectionId) => {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/collections/${collectionId}/items`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setCollectionItems(res.ok ? data : []);
    },
    [BACKEND_URL]
  );

  // ✅ Send API request (Logic unchanged)
  const handleSendRequest = useCallback(async () => {
    setLoading(true);
    setResponse(null);

    try {
      const authHeaders = await getAuthHeaders();

      const processedHeaders = headers.reduce((acc, { key, value }) => {
        if (key)
          acc[applyEnvironment(key, envs[activeEnv])] = applyEnvironment(value, envs[activeEnv]);
        return acc;
      }, { "Content-Type": "application/json" });

      const paramString = params
        .filter((p) => p.key && p.value)
        .map(
          (p) =>
            `${encodeURIComponent(applyEnvironment(p.key, envs[activeEnv]))}=${encodeURIComponent(
              applyEnvironment(p.value, envs[activeEnv])
            )}`
        )
        .join("&");

      const fullUrl = paramString ? `${applyEnvironment(url, envs[activeEnv])}?${paramString}` : applyEnvironment(url, envs[activeEnv]);

      const bodyPayload =
        method !== "GET" && method !== "DELETE"
          ? JSON.parse(applyEnvironment(bodyContent, envs[activeEnv]) || "{}")
          : null;

      const proxyRes = await fetch(`${BACKEND_URL}/api/proxy`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          url: fullUrl,
          method,
          headers: processedHeaders,
          body: bodyPayload,
        }),
      });

      const proxyData = await proxyRes.json();
      setResponse(proxyData);

      // ✅ Save to history (Logic unchanged)
      await fetch(`${BACKEND_URL}/api/history`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          url: fullUrl,
          method,
          request_headers: processedHeaders,
          request_body: bodyPayload,
          request_params: params.reduce((acc, p) => {
            if (p.key) acc[p.key] = p.value;
            return acc;
          }, {}),
          response_status: proxyRes.status,
          response_body: proxyData,
        }),
      });

      fetchHistory();
    } catch (err) {
      // Assuming a structured error response is needed
      setResponse({ status: 0, error: "Network error or failed to process request." });
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, params, bodyContent, BACKEND_URL, fetchHistory, activeEnv, envs]);

  // ✅ Fetch data on mount (Logic unchanged)
  useEffect(() => {
    fetchHistory();
    fetchCollections();
  }, [fetchHistory, fetchCollections]);

  return (
    // ✨ COLOR CHANGE APPLIED: Switched to bg-gray-900 and light text (text-gray-100)
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar
        historyList={historyList}
        collections={collections}
        collectionItems={collectionItems}
        activeCollectionId={activeCollectionId}
        selectedHistoryId={selectedHistoryId}
        handleCollectionToggle={(id) => {
          setActiveCollectionId(activeCollectionId === id ? null : id);
          fetchCollectionItems(id);
        }}
        loadItemDetails={async (id, type = "history") => {
          try {
            const authHeaders = await getAuthHeaders();

            const endpoint =
              type === "collection"
                ? `${BACKEND_URL}/api/collections/items/${id}`
                : `${BACKEND_URL}/api/history/${id}`;

            const res = await fetch(endpoint, { headers: authHeaders });
            const item = await res.json();

            if (!res.ok) {
              console.error("Backend error:", item);
              throw new Error(item?.message || "Item not found");
            }

            loadItemDetails(item);
          } catch (err) {
            console.error("Failed to load history detail", err);
          }
        }}
      />

      <main className="flex-grow flex flex-col p-6 space-y-6 overflow-hidden">
        {/* ✅ ENV MANAGER */}
        <EnvManager
          activeEnv={activeEnv}
          setActiveEnv={setActiveEnv}
          envs={envs}
          setEnvs={setEnvs}
        />

        <RequestForm
          url={url}
          setUrl={setUrl}
          method={method}
          setMethod={setMethod}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          bodyContent={bodyContent}
          setBodyContent={setBodyContent}
          headers={headers}
          setHeaders={setHeaders}
          params={params}
          setParams={setParams}
          handleSendRequest={handleSendRequest}
          collections={collections}
          fetchCollections={fetchCollections}
        />

        <ResponseViewer response={response} />
      </main>
    </div>
  );
}