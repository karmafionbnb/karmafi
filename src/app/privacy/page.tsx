import React from "react";
import type { Metadata } from "next";
import {
  StaticPageLayout,
  PageHero,
  PageSection,
  TableOfContents,
  LegalNoticeBox,
} from "@/components/shared/StaticPageLayout";

export const metadata: Metadata = {
  title: "KarmaFi Privacy Policy",
  description:
    "Learn how KarmaFi handles wallet addresses, Reddit verification data, analytics, and platform usage information.",
};

export default function PrivacyPage() {
  const tocItems = [
    { id: "overview", label: "1. Overview" },
    { id: "collection", label: "2. Information We Collect" },
    { id: "usage", label: "3. How We Use Information" },
    { id: "blockchain", label: "4. Blockchain Transparency" },
    { id: "reddit-verification", label: "5. Reddit Verification" },
    { id: "cookies", label: "6. Cookies and Analytics" },
    { id: "sharing", label: "7. Data Sharing" },
    { id: "retention", label: "8. Data Retention" },
    { id: "security", label: "9. Security" },
    { id: "rights", label: "10. User Rights" },
    { id: "contact", label: "11. Contact" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="Legal"
        heading="Privacy Policy"
        subheading="How KarmaFi collects, uses, and protects your information while interacting with the platform."
      />

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          <TableOfContents items={tocItems} />

          <div className="flex-1 max-w-[800px]">
            <LegalNoticeBox>
              This privacy policy is a draft template and should be reviewed by qualified legal counsel before production use.
            </LegalNoticeBox>
            
            <p className="text-[14px] text-[#8A817A] italic mb-10">Last updated: {currentDate}</p>

            <PageSection id="overview" title="1. Overview">
              <p>This Privacy Policy explains how KarmaFi collects, uses, and discloses information about you when you access or use our platform, website, and related services.</p>
            </PageSection>

            <PageSection id="collection" title="2. Information We Collect">
              <p>When you use KarmaFi, we may collect:</p>
              <ul>
                <li>Wallet addresses connected to the platform</li>
                <li>Transaction hashes and public blockchain data</li>
                <li>Reddit post metadata submitted during market launch</li>
                <li>Reddit OAuth verification data if the creator claim vault is used</li>
                <li>Analytics data, including device, browser, and usage metrics</li>
                <li>Any support messages or direct correspondence</li>
              </ul>
            </PageSection>

            <PageSection id="usage" title="3. How We Use Information">
              <p>We use the collected information to:</p>
              <ul>
                <li>Operate, maintain, and improve the platform</li>
                <li>Process and verify creator claims securely</li>
                <li>Prevent abuse, fraud, and illegal activity</li>
                <li>Display relevant market information</li>
                <li>Comply with legal and safety obligations</li>
              </ul>
            </PageSection>

            <PageSection id="blockchain" title="4. Blockchain Transparency">
              <p>Please note that blockchain transactions are public. When you connect your wallet and perform on-chain actions, this data becomes part of an immutable public ledger and cannot be deleted or modified by KarmaFi.</p>
            </PageSection>

            <PageSection id="reddit-verification" title="5. Reddit Verification">
              <p>If the creator claim feature is used, KarmaFi may process limited Reddit account verification data (such as username and post ID) solely to confirm post ownership. We store only what is strictly necessary and hash sensitive identifiers where possible to preserve privacy.</p>
            </PageSection>

            <PageSection id="cookies" title="6. Cookies and Analytics">
              <p>We may use cookies and similar tracking technologies to monitor platform usage, analyze trends, and administer the website. You can control cookie preferences through your browser settings.</p>
            </PageSection>

            <PageSection id="sharing" title="7. Data Sharing">
              <p>We do not sell your personal data. We may share information with trusted service providers, infrastructure partners, or legal authorities if reasonably required by law or to protect the safety of the platform and its users.</p>
            </PageSection>

            <PageSection id="retention" title="8. Data Retention">
              <p>Data is retained only as long as necessary for product operation, security, legal compliance, or active dispute resolution.</p>
            </PageSection>

            <PageSection id="security" title="9. Security">
              <p>We implement reasonable safeguards to protect user data. However, no internet transmission or electronic storage is 100% secure, and we cannot guarantee absolute security of your information.</p>
            </PageSection>

            <PageSection id="rights" title="10. User Rights">
              <p>Depending on your jurisdiction, you may have the right to request access to, correction of, or deletion of your personal data. You may contact KarmaFi for any such privacy requests.</p>
            </PageSection>

            <PageSection id="contact" title="11. Contact">
              <p>For privacy-related inquiries, please contact: <a href="mailto:support@karmafi.xyz">support@karmafi.xyz</a></p>
            </PageSection>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
