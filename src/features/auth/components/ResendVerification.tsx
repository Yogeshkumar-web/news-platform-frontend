"use client";

import { useState } from "react";
import { resendVerificationAction } from "../actions/resend-action";

interface ResendVerificationProps {
    email?: string;
}

export function ResendVerification({ email }: ResendVerificationProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [emailInput, setEmailInput] = useState(email || "");

    async function handleResend() {
        if (!emailInput) {
            setMessage({ type: "error", text: "Please enter your email address." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const result = await resendVerificationAction(emailInput);
            
            if (result.success) {
                setMessage({ type: "success", text: result.message });
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto">
            {!email && (
                <div className="mb-4">
                    <label htmlFor="resend-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="resend-email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
            )}

            <button
                onClick={handleResend}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Sending..." : "Resend Verification Email"}
            </button>

            {message && (
                <p className={`mt-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
