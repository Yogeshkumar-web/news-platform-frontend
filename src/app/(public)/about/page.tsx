import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { BRAND, EDITORIAL_PILLARS } from "@/lib/brand";

export const metadata: Metadata = {
    title: "About",
    description: `About ${BRAND.name}, an independent opinion-journalism platform built around Public Mat.`,
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-gray-950">
            <Header />
            <main>
                <Container className="py-12 md:py-16">
                    <header className="max-w-4xl border-b-4 border-gray-950 pb-10">
                        <p className="text-sm font-bold uppercase text-[#d95353]">About {BRAND.name}</p>
                        <h1 className="mt-3 font-serif text-4xl font-black leading-tight md:text-6xl">
                            Janta ki awaaz ko vichaar ka roop dena.
                        </h1>
                    </header>

                    <section className="max-w-4xl py-10 text-lg leading-8 text-gray-700 md:text-xl">
                        <p>
                            {BRAND.name} ek independent opinion-journalism platform hai - jahan har khabar ko sirf report nahi kiya jaata, balki desh ke aam nagrik ke nazariye se parkha jaata hai.
                        </p>
                        <p className="mt-6">
                            Hamare liye <strong>PM</strong> ka matlab kisi pad ya party se nahi hai - yeh <strong>Public Mat</strong> hai. Loktantra mein sabse bada adhikar janta ke vichaar ka hota hai, aur {BRAND.name} usi vichaar ko manch deta hai.
                        </p>
                        <p className="mt-6">
                            Hum kisi party ke samarthak nahi, kisi sarkar ke virodhi nahi. Hum sirf nishpaksh, seedhi aur bebaak patrakarita ke liye khade hain, jahan har mudda samajh, tark aur sach ke aadhaar par pesh kiya jaata hai.
                        </p>
                    </section>

                    <section className="border-t border-gray-300 py-10">
                        <h2 className="font-serif text-3xl font-black">Editorial Pillars</h2>
                        <div className="mt-8 grid gap-x-10 md:grid-cols-2">
                            {EDITORIAL_PILLARS.map((pillar) => (
                                <article key={pillar.title} className="border-t border-gray-950 py-6">
                                    <h3 className="text-xl font-bold">{pillar.title}</h3>
                                    <p className="mt-2 leading-7 text-gray-600">{pillar.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="border-y border-gray-950 py-8 text-center">
                        <p className="font-serif text-2xl font-black">{BRAND.tagline}</p>
                        <p className="mt-2 text-gray-600">{BRAND.positioning}</p>
                    </section>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
