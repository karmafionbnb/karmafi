import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle, BookOpen } from "lucide-react";
import Link from "next/link";

export function StaticPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDFC]">
      <Navbar />
      <main className="flex-1 w-full pb-16">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  heading,
  subheading,
  children,
}: {
  eyebrow: string;
  heading: ReactNode;
  subheading: string;
  children?: ReactNode;
}) {
  return (
    <section className="w-full bg-[#FFFAF5] pt-16 pb-20 border-b border-[#F2D8C8]">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
          <span className="mb-4 rounded-full bg-[#FFF1ED] border border-[#F1DDD0] px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-[#FF6B1A] uppercase">
            {eyebrow}
          </span>
          <h1 className="text-[40px] md:text-[52px] font-black tracking-tight text-[#161616] mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-[18px] md:text-[20px] font-medium text-[#5F5B57] leading-relaxed mb-8">
            {subheading}
          </p>
          {children && (
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function TableOfContents({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-[100px]">
      <div className="rounded-[24px] bg-[#FFFAF5] border border-[#F2D8C8] p-6 shadow-sm">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-[#161616] mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#FF6B1A]" /> Contents
        </h3>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[14.5px] font-medium text-[#5F5B57] hover:text-[#FF6B1A] transition-colors py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function PageSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-[100px] mb-16">
      <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
        {title}
      </h2>
      <div className="prose prose-lg prose-headings:text-[#161616] prose-headings:font-black prose-p:text-[#5F5B57] prose-p:font-medium prose-p:leading-relaxed prose-a:text-[#FF6B1A] prose-a:no-underline hover:prose-a:underline prose-li:text-[#5F5B57] prose-li:font-medium prose-strong:text-[#161616] max-w-none">
        {children}
      </div>
    </div>
  );
}

export function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-[#FFFDFB] border border-[#E8D4C8] p-5 shadow-sm">
      <h4 className="text-[16px] font-bold text-[#161616] mb-2 m-0">{title}</h4>
      <p className="text-[14.5px] text-[#8A817A] m-0 leading-relaxed">{description}</p>
    </div>
  );
}

export function CalloutCard({
  title,
  children,
  type = "warning",
}: {
  title: ReactNode;
  children: ReactNode;
  type?: "warning" | "info" | "success";
}) {
  const bg =
    type === "warning"
      ? "bg-[#FFF1ED] border-[#FFAB66]/30"
      : type === "success"
      ? "bg-[#F0FDF4] border-[#BBF7D0]"
      : "bg-[#F0F9FF] border-[#BAE6FD]";

  const textCol =
    type === "warning"
      ? "text-[#E9500E]"
      : type === "success"
      ? "text-[#16A34A]"
      : "text-[#0284C7]";

  const contentCol =
    type === "warning"
      ? "text-[#D9450A]"
      : type === "success"
      ? "text-[#15803D]"
      : "text-[#0369A1]";

  return (
    <div className={`rounded-2xl border ${bg} p-6 shadow-sm mb-6`}>
      <h4 className={`flex items-center gap-2 text-[16px] font-bold ${textCol} mb-2 m-0`}>
        {title}
      </h4>
      <div className={`text-[15px] font-medium ${contentCol} m-0 leading-relaxed prose prose-p:${contentCol} prose-a:${contentCol} prose-li:${contentCol}`}>
        {children}
      </div>
    </div>
  );
}

export function LegalNoticeBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-[#E9500E]/20 bg-gradient-to-br from-[#FFF1ED] to-[#FFFAF5] p-6 shadow-sm mb-10 relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="mb-2 text-[18px] font-extrabold text-[#161616] flex items-center gap-2 m-0">
          <AlertTriangle className="h-5 w-5 text-[#E9500E]" /> Important Notice
        </h3>
        <p className="text-[15px] font-medium leading-relaxed text-[#D9450A] m-0">
          {children}
        </p>
      </div>
    </div>
  );
}
