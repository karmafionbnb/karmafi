import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/wallet";
import RiskAcknowledgementModal from "@/components/RiskAcknowledgementModal";
import Web3Provider from "@/components/web3/Web3Provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://karmafi.app"),
  title: {
    default: "KarmaFi — Trade Reddit Attention Before It Goes Viral",
    template: "%s · KarmaFi",
  },
  description:
    "KarmaFi lets curators launch BNB Chain attention markets around trending Reddit posts. Speculate on public social momentum early.",
  openGraph: {
    title: "KarmaFi — Trade Reddit Attention Before It Goes Viral",
    description:
      "Launch and trade attention markets around viral Reddit posts on BNB Chain. Creators earn a reserved share of every trade.",
    url: "https://karmafi.app",
    siteName: "KarmaFi",
    images: [{ url: "/logo.png", width: 500, height: 500, alt: "KarmaFi" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@KarmafiBNB",
    title: "KarmaFi — Trade Reddit Attention Before It Goes Viral",
    description:
      "Launch and trade attention markets around viral Reddit posts on BNB Chain.",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

// Applies the saved (or system) theme before first paint to avoid a flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem('karmafi-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
