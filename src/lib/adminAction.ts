// Client helper for admin-gated endpoints: signs an authorization message with
// the connected admin wallet and posts it. The server (isAdminRequest) recovers
// the signer and checks it against the admin allowlist.
export async function adminAction(
  endpoint: string,
  body: Record<string, unknown>,
  walletAddress: string,
  signMessage: (m: string) => Promise<string>
): Promise<Record<string, unknown>> {
  if (!walletAddress) throw new Error("Connect your admin wallet first.");
  const adminMessage = `KarmaFi admin authorization\nendpoint: ${endpoint}\npayload: ${JSON.stringify(body)}`;
  const adminSignature = await signMessage(adminMessage);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, adminWallet: walletAddress, adminSignature, adminMessage }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.error || "Action failed");
  return data;
}
