import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PuraAgua } from "@/components/pura-agua";
import { Reveal } from "@/components/reveal";
import { author, sortedPosts } from "@/lib/blog";
import { getDict } from "@/lib/dict";
import { fill, isLocale, localePath, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return pageMeta({ locale, path: "/blog", ...dict.meta.blog });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const posts = sortedPosts();
  const [lead, ...rest] = posts;

  return (
    <section className="section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{dict.blog.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(30px,4.8vw,54px)]">{dict.blog.title}</h1>
          <p className="lede mt-5 max-w-2xl">{dict.blog.body}</p>
        </Reveal>

        {lead ? (
          <Reveal delay={80}>
            <Link
              href={localePath(locale, `/blog/${lead.slug}`)}
              className="card card-hover mt-12 grid overflow-hidden md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] w-full md:aspect-auto md:h-full md:min-h-[320px]">
                <Image
                  src={lead.image}
                  alt={lead.imageAlt[locale as Locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <Meta post={lead} locale={locale} dict={dict} />
                <h2 className="mt-3 text-[clamp(22px,2.6vw,32px)]">{lead.title[locale as Locale]}</h2>
                <p className="mt-3 text-[15px] text-ink-2">{lead.excerpt[locale as Locale]}</p>
                <span className="mt-6 font-display text-[14px] font-semibold text-teal">
                  {dict.blog.readMore}
                </span>
              </div>
            </Link>
          </Reveal>
        ) : null}

        <Reveal delay={60} className="mt-6">
          <PuraAgua locale={locale} dict={dict} />
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, index) => (
            <Reveal key={post.slug} delay={index * 70}>
              <Link
                href={localePath(locale, `/blog/${post.slug}`)}
                className="card card-hover flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={post.image}
                    alt={post.imageAlt[locale as Locale]}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Meta post={post} locale={locale} dict={dict} />
                  <h2 className="mt-2 text-[19px]">{post.title[locale as Locale]}</h2>
                  <p className="mt-2 flex-1 text-[14px] text-ink-2">{post.excerpt[locale as Locale]}</p>
                  <span className="mt-4 font-display text-[13px] font-semibold text-teal">
                    {dict.blog.readMore}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Meta({
  post,
  locale,
  dict,
}: {
  post: ReturnType<typeof sortedPosts>[number];
  locale: string;
  dict: ReturnType<typeof getDict>;
}) {
  const date = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.date));

  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[12px] uppercase tracking-[0.1em] text-ink-3">
      <span className="font-semibold text-teal">{post.tag[locale as Locale]}</span>
      <span aria-hidden="true">·</span>
      <span>{date}</span>
      <span aria-hidden="true">·</span>
      <span>{fill(dict.blog.readingTime, { n: post.readingMinutes })}</span>
      <span aria-hidden="true">·</span>
      <span>{dict.blog.by} {author.name}</span>
    </p>
  );
}
