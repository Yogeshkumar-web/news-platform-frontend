import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

type ArticleInvalidationInput = {
    articleId?: string;
    slug?: string;
};

export function invalidateArticleLists(queryClient: QueryClient) {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.articles.lists(),
    });
}

export function invalidateMyArticles(queryClient: QueryClient) {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.articles.my(),
    });
}

export async function invalidateArticleData(
    queryClient: QueryClient,
    input: ArticleInvalidationInput = {}
) {
    await Promise.all([
        invalidateArticleLists(queryClient),
        invalidateMyArticles(queryClient),
        queryClient.invalidateQueries({
            queryKey: queryKeys.articles.featured(),
        }),
        queryClient.invalidateQueries({
            queryKey: queryKeys.articles.categories(),
        }),
        input.slug
            ? queryClient.invalidateQueries({
                  queryKey: queryKeys.articles.detail(input.slug),
              })
            : Promise.resolve(),
        input.articleId
            ? queryClient.invalidateQueries({
                  queryKey: queryKeys.articles.edit(input.articleId),
              })
            : Promise.resolve(),
    ]);
}

export async function invalidateCommentsForArticle(
    queryClient: QueryClient,
    articleId: string
) {
    await Promise.all([
        queryClient.invalidateQueries({
            queryKey: queryKeys.comments.article(articleId),
        }),
        queryClient.invalidateQueries({
            queryKey: queryKeys.comments.stats(articleId),
        }),
    ]);
}

export async function invalidateAuth(queryClient: QueryClient) {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
    ]);
}

export async function clearPrivateData(queryClient: QueryClient) {
    await Promise.all([
        queryClient.removeQueries({ queryKey: queryKeys.auth.all }),
        queryClient.removeQueries({ queryKey: queryKeys.user.all }),
        queryClient.removeQueries({ queryKey: queryKeys.articles.my() }),
        queryClient.removeQueries({ queryKey: queryKeys.comments.user() }),
    ]);
}
