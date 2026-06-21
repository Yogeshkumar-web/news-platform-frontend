import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
    article: Article;
    priority?: boolean;
}

function ArticleImage({
    article,
    className,
    priority = false,
}: ArticleCardProps & { className?: string }) {
    return (
        <div className={cn("relative overflow-hidden bg-gray-100", className)}>
            {article.thumbnail ? (
                <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    priority={priority}
                    sizes='(min-width: 1024px) 50vw, 100vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
            ) : (
                <div className='flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400'>
                    No image
                </div>
            )}
        </div>
    );
}

function ArticleMeta({ article }: ArticleCardProps) {
    return (
        <div className='flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500'>
            <span className='text-gray-700'>By {article.author.name}</span>
            <span aria-hidden='true'>&bull;</span>
            <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
        </div>
    );
}

function ArticleCategory({ article }: ArticleCardProps) {
    const category = article.categories?.[0];

    if (!category) return null;

    return (
        <Badge variant='blue' className='mb-3 rounded-sm uppercase tracking-wider'>
            {category.label}
        </Badge>
    );
}

export function HeroArticleCard({ article, priority = false }: ArticleCardProps) {
    return (
        <article className='grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8'>
            <div className='order-2 flex flex-col justify-center md:order-1 md:col-span-5'>
                <Link href={`/articles/${article.slug}`} className='group block'>
                    <h2 className='mb-4 font-serif text-3xl font-bold leading-tight text-gray-950 transition-colors group-hover:text-[#d95353] md:text-4xl lg:text-5xl'>
                        {article.title}
                    </h2>
                </Link>
                {article.excerpt && (
                    <p className='mb-6 line-clamp-4 text-lg leading-relaxed text-gray-600'>
                        {article.excerpt}
                    </p>
                )}
                <ArticleMeta article={article} />
            </div>

            <Link
                href={`/articles/${article.slug}`}
                className='group order-1 block md:order-2 md:col-span-7'
            >
                <ArticleImage
                    article={article}
                    priority={priority}
                    className='aspect-[4/3] rounded-sm md:aspect-[16/10]'
                />
            </Link>
        </article>
    );
}

export function SplitArticleCard({ article }: ArticleCardProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className='group grid grid-cols-12 items-start gap-4'
        >
            <article className='col-span-7'>
                <ArticleCategory article={article} />
                <h3 className='mb-2 font-serif text-xl font-bold leading-snug text-gray-950 transition-colors group-hover:text-[#d95353]'>
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className='mb-2 line-clamp-2 text-sm text-gray-600'>
                        {article.excerpt}
                    </p>
                )}
                <time className='text-xs text-gray-500' dateTime={article.createdAt}>
                    {formatDate(article.createdAt)}
                </time>
            </article>
            <ArticleImage
                article={article}
                className='col-span-5 aspect-[4/3] rounded-sm'
            />
        </Link>
    );
}

export function GridArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/articles/${article.slug}`} className='group block'>
            <article>
                <ArticleImage article={article} className='mb-3 aspect-video rounded-sm' />
                <h4 className='mb-2 font-serif text-lg font-bold leading-tight text-gray-950 transition-colors group-hover:text-[#d95353]'>
                    {article.title}
                </h4>
                <time className='text-xs text-gray-500' dateTime={article.createdAt}>
                    {formatDate(article.createdAt)}
                </time>
            </article>
        </Link>
    );
}

export function SidebarArticleCard({ article }: ArticleCardProps) {
    const authorInitial = article.author.name.charAt(0).toUpperCase();

    return (
        <Link
            href={`/articles/${article.slug}`}
            className='group block border-b border-gray-100 pb-6 last:border-0'
        >
            <article className='flex items-start gap-3'>
                <div className='min-w-0 flex-1'>
                    <span className='mb-1 block text-xs text-gray-500'>
                        {article.author.name}
                    </span>
                    <h4 className='font-serif text-lg font-medium leading-snug text-gray-950 transition-colors group-hover:text-[#d95353]'>
                        {article.title}
                    </h4>
                </div>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 font-serif font-bold text-gray-500'>
                    {authorInitial}
                </div>
            </article>
        </Link>
    );
}
