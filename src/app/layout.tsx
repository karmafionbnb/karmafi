import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/wallet";
import RiskAcknowledgementModal from "@/components/RiskAcknowledgementModal";

export const metadata: Metadata = {
  title: "KarmaFi - Trade Reddit Attention Before It Goes Viral",
  description: "KarmaFi lets curators launch BNB Chain attention markets around trending Reddit posts. Speculate on public social momentum early.",
};

import Web3Provider from "@/components/web3/Web3Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Tailwind CDN — processes utility classes without a build step */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.tailwind = window.tailwind || {};
              window.tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      brand: {
                        bg: 'var(--bg-outer-left)',
                        shell: 'var(--page-shell)',
                        surface: 'var(--surface-primary)',
                        'surface-secondary': 'var(--surface-secondary)',
                        peach: 'var(--surface-peach)',
                        orange: 'var(--primary-orange)',
                        'deep-orange': 'var(--primary-orange-dark)',
                        bnb: 'var(--bnb-yellow)',
                        charcoal: 'var(--text-primary)',
                        muted: 'var(--text-muted)',
                        secondary: 'var(--text-secondary)',
                        border: 'var(--border-warm)',
                        success: 'var(--accent-green)',
                        cyan: 'var(--accent-cyan)',
                        purple: 'var(--accent-purple)',
                        error: 'var(--danger-red)',
                      }
                    },
                    fontFamily: {
                      sans: ["'Plus Jakarta Sans'", 'system-ui', 'sans-serif'],
                    },
                    boxShadow: {
                      'premium': '0 20px 40px -10px rgba(0,0,0,0.05), 0 0 20px rgba(255, 107, 26, 0.05)',
                    }
                  }
                }
              };
            `,
          }}
        />
        <script src="https://cdn.tailwindcss.com" async />
      </head>
      <body>
        <Web3Provider>
          <WalletProvider>
            {children}
            <RiskAcknowledgementModal />
          </WalletProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
