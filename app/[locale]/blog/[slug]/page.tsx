import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { findPost, posts, relatedPosts } from "@/lib/blog";
import { getDict } from "@/lib/dict";
import { fill, isLocale, locales, localePath, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/metadata";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { site } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = findPost(slug);
  if (!post) return {};

  return pageMeta({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title[locale]} | ${site.name}`,
    description: post.excerpt[locale],
  });
}

export default async function PostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = findPost(slug);
  if (!post) notFound();

  const dict = getDict(locale);
  const related = relatedPosts(slug);
  const date = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.date));

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph([
              breadcrumbSchema([
                { name: site.name, url: `${site.url}/${locale}` },
                { name: "Blog", url: `${site.url}/${locale}/blog` },
                { name: post.title[locale], url: `${site.url}/${locale}/blog/${slug}` },
              ]),
              {
                "@type": "BlogPosting",
                headline: post.title[locale],
                description: post.excerpt[locale],
                image: `${site.url}${post.image}`,
                datePublished: post.date,
                dateModified: post.date,
                inLanguage: locale,
                mainEntityOfPage: `${site.url}/${locale}/blog/${slug}`,
                publisher: { "@id": `${site.url}/#organization` },
                author: { "@id": `${site.url}/#organization` },
              },
            ]),
          ),
        }}
      />

      <div className="shell max-w-3xl pt-14">
        <Link
          href={localePath(locale, "/blog")}
          className="text-[13px] text-ink-3 transition-colors hover:text-ink"
        >
          {dict.blog.backToBlog}
        </Link>

        <p className="mt-6 flex flex-wrap items-center gap-x-2 text-[12px] uppercase tracking-[0.1em] text-ink-3">
          <span className="font-semibold text-teal">{post.tag[locale]}</span>
          <span aria-hidden="true">·</span>
          <span>{date}</span>
          <span aria-hidden="true">·</span>
          <span>{fill(dict.blog.readingTime, { n: post.readingMinutes })}</span>
        </p>

        <h1 className="mt-4 text-[clamp(30px,4.6vw,52px)]">{post.title[locale]}</h1>
        <p className="lede mt-5">{post.excerpt[locale]}</p>
      </div>

      <div className="shell max-w-4xl">
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-line">
          <Image
            src={post.image}
            alt={post.imageAlt[locale]}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="shell max-w-3xl pb-4 pt-12">
        <div className="space-y-6">
          {post.body[locale].map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2 key={index} className="pt-4 text-[clamp(21px,2.6vw,30px)]">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={index} className="space-y-2.5 text-[17px] text-ink-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "note") {
              return (
                <p
                  key={index}
                  className="rounded-2xl border-l-4 border-teal bg-mist px-5 py-4 text-[16px] text-ink-2"
                >
                  {block.text}
                </p>
              );
            }
            return (
              <p key={index} className="text-[17px] leading-relaxed text-ink-2">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-14 rounded-3xl bg-invert p-8 text-invert-fg md:p-10">
          <h2 className="max-w-xl text-[clamp(22px,3vw,32px)] text-invert-fg">{dict.blog.ctaBody}</h2>
          <Link
            href={localePath(locale, "/products")}
            className="btn mt-6 bg-aqua text-[#04141b] hover:brightness-105"
          >
            {dict.blog.cta}
          </Link>
        </div>
      </div>

      {related.length ? (
        <section className="section">
          <div className="shell">
            <h2 className="text-[clamp(20px,2.6vw,28px)]">{dict.blog.related}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 70}>
                  <Link
                    href={localePath(locale, `/blog/${item.slug}`)}
                    className="card card-hover flex h-full gap-4 overflow-hidden p-4"
                  >
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={item.imageAlt[locale as Locale]}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal">
                        {item.tag[locale as Locale]}
                      </p>
                      <h3 className="mt-1 text-[17px]">{item.title[locale as Locale]}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
