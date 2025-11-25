"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./query-client";
import { useState } from "react";

/**
 * React Query Provider Component
 * Wrap your app with this to enable React Query
 *
 * @example
 * // In app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <QueryProvider>{children}</QueryProvider>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
    // Create stable QueryClient instance
    // Using useState ensures client is created once per component mount
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {/* React Query Devtools (only in development) */}
            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    position='bottom'
                    buttonPosition='bottom-right'
                />
            )}
        </QueryClientProvider>
    );
}
