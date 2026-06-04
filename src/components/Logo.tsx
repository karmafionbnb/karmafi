import React from "react";
import Image from "next/image";

export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src="/logo.png"
        alt="KarmaFi Logo"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 40px, 48px"
      />
    </div>
  );
}
