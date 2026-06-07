import { recoverMessageAddress } from "viem";

// Admin wallets (server-side env, falls back to the public one / treasury).
export function adminWallets(): string[] {
  const configured = process.env.ADMIN_WALLETS || process.env.NEXT_PUBLIC_ADMIN_WALLETS || "";
  // Built-in owner wallet so admin works before envs are set.
  return `${configured},0x6e8af50F4Ac26F41e0478d509CAef8707de16eE0`
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function recoverSigner(message: string, signature: string): Promise<string | null> {
  try {
    const addr = await recoverMessageAddress({ message, signature: signature as `0x${string}` });
    return addr.toLowerCase();
  } catch {
    return null;
  }
}

// Verify a signed message recovers to the claimed wallet (proves control).
export async function verifyWalletSignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  const signer = await recoverSigner(message, signature);
  return !!signer && !!expectedAddress && signer === expectedAddress.toLowerCase();
}

// Verify a request is from an allowlisted admin wallet via a signed message.
export async function isAdminRequest(body: {
  adminWallet?: string;
  adminSignature?: string;
  adminMessage?: string;
}): Promise<boolean> {
  const { adminWallet, adminSignature, adminMessage } = body || {};
  if (!adminWallet || !adminSignature || !adminMessage) return false;
  const signer = await recoverSigner(adminMessage, adminSignature);
  if (!signer || signer !== adminWallet.toLowerCase()) return false;
  return adminWallets().includes(signer);
}
