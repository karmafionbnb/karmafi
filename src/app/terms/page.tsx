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
  title: "KarmaFi Terms of Service",
  description:
    "Read the KarmaFi Terms of Service for using Karma Markets, creator rewards, curator incentives, and BNB Chain features.",
};

export default function TermsPage() {
  const tocItems = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "description", label: "2. Description of Service" },
    { id: "no-ownership", label: "3. No Ownership of Reddit Content" },
    { id: "eligibility", label: "4. Eligibility" },
    { id: "wallets", label: "5. Wallets and Blockchain" },
    { id: "risks", label: "6. Market Risks" },
    { id: "prohibited", label: "7. Prohibited Conduct" },
    { id: "creator-claims", label: "8. Creator Claims" },
    { id: "moderation", label: "9. Moderation and Removal" },
    { id: "fees", label: "10. Fees" },
    { id: "no-advice", label: "11. No Financial Advice" },
    { id: "liability", label: "12. Limitation of Liability" },
    { id: "changes", label: "13. Changes to Terms" },
    { id: "contact", label: "14. Contact" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="Legal"
        heading="Terms of Service"
        subheading="Please read these terms carefully before using the KarmaFi protocol and platform."
      />

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          <TableOfContents items={tocItems} />

          <div className="flex-1 max-w-[800px]">
            <LegalNoticeBox>
              This page is a draft template for product launch preparation and should be reviewed by qualified legal counsel before production use.
            </LegalNoticeBox>
            
            <p className="text-[14px] text-[#8A817A] italic mb-10">Last updated: {currentDate}</p>

            <PageSection id="acceptance" title="1. Acceptance of Terms">
              <p>By accessing or using KarmaFi, users agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.</p>
            </PageSection>

            <PageSection id="description" title="2. Description of Service">
              <p>KarmaFi provides tools and smart contracts for creating and interacting with attention markets around public Reddit post momentum on BNB Chain. It is an experimental social trading protocol.</p>
            </PageSection>

            <PageSection id="no-ownership" title="3. No Ownership of Reddit Content">
              <p>Karma Markets do not represent ownership, copyright, licensing, endorsement, sponsorship, or affiliation with Reddit or the original poster. KarmaFi indexes public momentum and creates independent speculative markets based on that data.</p>
            </PageSection>

            <PageSection id="eligibility" title="4. Eligibility">
              <p>Users are responsible for complying with applicable laws and restrictions in their jurisdiction before accessing or trading on the platform. KarmaFi is not intended for use where prohibited by law.</p>
            </PageSection>

            <PageSection id="wallets" title="5. Wallets and Blockchain Transactions">
              <p>Users are solely responsible for wallet security, private keys, transaction approvals, gas fees, and all on-chain actions. Transactions on the blockchain are irreversible.</p>
            </PageSection>

            <PageSection id="risks" title="6. Market Risks">
              <p>Karma Markets are highly speculative and volatile. Tokens can lose value entirely or become worthless. Users assume all financial risk associated with trading.</p>
            </PageSection>

            <PageSection id="prohibited" title="7. Prohibited Conduct">
              <p>Users agree not to engage in:</p>
              <ul>
                <li>Illegal activity</li>
                <li>Market manipulation</li>
                <li>Impersonation</li>
                <li>Spam or abuse</li>
                <li>Doxxing or harassment</li>
                <li>Hate content or illegal material</li>
                <li>Exploiting bugs or vulnerabilities</li>
                <li>Launching markets around prohibited content</li>
              </ul>
            </PageSection>

            <PageSection id="creator-claims" title="8. Creator Claims">
              <p>Creator claims require strict verification. KarmaFi reserves the right to delay, reject, or reverse claims that are suspected of being fraudulent, suspicious, or in violation of these Terms.</p>
            </PageSection>

            <PageSection id="moderation" title="9. Moderation and Removal">
              <p>KarmaFi may hide, restrict, or remove frontend access to markets that violate policies, create legal risk, or compromise user safety. This does not alter the underlying blockchain state, but removes visibility on the platform.</p>
            </PageSection>

            <PageSection id="fees" title="10. Fees">
              <p>Fees may apply to trading, launching markets, claiming rewards, or general protocol use. Fee parameters and distribution percentages may change at the discretion of the protocol during Alpha and Beta testing.</p>
            </PageSection>

            <PageSection id="no-advice" title="11. No Financial Advice">
              <p>KarmaFi does not provide financial, legal, tax, or investment advice. All information on the platform is for informational and product testing purposes only.</p>
            </PageSection>

            <PageSection id="liability" title="12. Limitation of Liability">
              <p>To the maximum extent permitted by law, KarmaFi and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of or inability to use the platform, including loss of funds, data, or profits.</p>
            </PageSection>

            <PageSection id="changes" title="13. Changes to Terms">
              <p>These Terms may be updated periodically. Continued use of the platform after updates constitutes acceptance of the new Terms.</p>
            </PageSection>

            <PageSection id="contact" title="14. Contact">
              <p>For support or legal inquiries, please contact: <a href="mailto:support@karmafi.xyz">support@karmafi.xyz</a></p>
            </PageSection>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
