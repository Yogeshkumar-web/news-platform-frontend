import { ArticleForm } from "@/features/articles/components/ArticleForm";

import { requireAdmin } from "@/lib/auth/session";

export default async function CreateArticlePage() {
    await requireAdmin();
    return (
        <div className='max-w-5xl mx-auto py-8'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-900'>
                    Write New Article
                </h1>
                <p className='text-gray-500 mt-2'>
                    Create a new article for the platform.
                </p>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <ArticleForm />
            </div>
        </div>
    );
}
