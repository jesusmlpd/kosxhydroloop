import Link from "next/link";
import { es } from "@/lib/dict/es";

/**
 * El not-found no recibe params, asi que va en el idioma default.
 */
export default function NotFound() {
  return (
    <section className="section">
      <div className="shell max-w-2xl py-16 text-center">
        <h1 className="text-[clamp(30px,4.6vw,50px)]">{es.notFound.title}</h1>
        <p className="lede mt-5">{es.notFound.body}</p>
        <Link href="/es" className="btn btn-primary mt-8">
          {es.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
