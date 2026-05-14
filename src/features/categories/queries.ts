import { cache } from "react";
import { serverGet } from "@/lib/api/server";
import type { Category } from "@/types";

export const getPublicCategories = cache(async (): Promise<Category[]> => {
    return serverGet<Category[]>("/api/categories", {
        next: {
            revalidate: 300,
            tags: ["categories"],
        },
    }).catch(() => []);
});
