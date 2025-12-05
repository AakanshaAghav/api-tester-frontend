"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
// Added necessary icons
import { UserPlus, User, Lock, Mail, Phone, ArrowLeft } from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // Added state for success message

  const handleSignup = async () => {
    setError(null);
    setSuccessMessage(null);

    // ✅ Frontend Validation (logic unchanged)
    if (!name || !phone || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!/^\d{10}$/.test(phone)) {
      return setError("Enter valid 10 digit phone number");
    }

    setLoading(true);

    // ✅ Create Auth User (logic unchanged)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    // ✅ Store additional user info in profiles table (logic unchanged)
    const userId = data.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          name,
          phone,
          email,
        },
      ]);

    setLoading(false);

    if (profileError) {
      return setError("Signup successful but profile save failed");
    }

    // --- SUCCESS: Replaced alert() with state and added a delay ---
    setSuccessMessage("Account created successfully! Redirecting to login...");
    setTimeout(() => {
      router.push("/login");
    }, 2000); // Wait 2 seconds before redirecting
  };

  return (
    // Updated background to match page.js and Login.jsx dark theme
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Signup Card: dark, rounded, shadow effect, and slightly interactive */}
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 md:p-10 rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-green-500/30">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <UserPlus className="h-12 w-12 text-green-400 mb-3" />
          <h2 className="text-3xl font-extrabold text-white">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mt-1">Join API Tester Pro to start managing requests</p>
        </div>

        {/* Error Message styled for dark mode */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Success Message styled for dark mode */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 p-3 rounded-lg mb-4 text-sm">
            {successMessage}
          </div>
        )}

        {/* Input: Full Name */}
        <div className="mb-4 relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            disabled={loading || !!successMessage}
          />
        </div>

        {/* Input: Phone Number */}
        <div className="mb-4 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Phone Number (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            disabled={loading || !!successMessage}
          />
        </div>

        {/* Input: Email Address */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            disabled={loading || !!successMessage}
          />
        </div>

        {/* Input: Password */}
        <div className="mb-4 relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            disabled={loading || !!successMessage}
          />
        </div>

        {/* Input: Confirm Password */}
        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            disabled={loading || !!successMessage}
          />
        </div>

        {/* Sign Up Button with loading state and green accent */}
        <button
          onClick={handleSignup}
          disabled={loading || !!successMessage}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 ${loading || !!successMessage
              ? "bg-green-800 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 hover:shadow-green-500/50"
            }`}
        >
          {loading ? (
            // Spinner for loading state
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <><UserPlus className="w-5 h-5" /> Sign Up</>
          )}
        </button>

        {/* Login Link matching the green accent and original logic */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 font-semibold cursor-pointer hover:underline hover:text-green-300 transition duration-150"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}