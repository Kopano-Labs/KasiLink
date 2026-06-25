export const SOLANA_WALLET_CLUSTER = "devnet" as const;
export const SOLANA_WALLET_ENDPOINT = "https://api.devnet.solana.com";

export const SOLANA_WALLET_ALLOWED_ADAPTERS = [
  "Phantom",
  "Solflare",
  "Trust",
] as const;

export const SOLANA_WALLET_GUARDRAILS = [
  "Devnet only",
  "External wallet custody",
  "No production-money claims",
  "Shared spine for future MVPs",
] as const;

export function shortenWalletAddress(address: string | null | undefined, visible = 4) {
  if (!address) {
    return "Not connected";
  }

  if (address.length <= visible * 2) {
    return address;
  }

  return `${address.slice(0, visible)}...${address.slice(-visible)}`;
}

export function getWalletConnectionLabel(connected: boolean, connecting: boolean) {
  if (connected) {
    return "Connected";
  }

  if (connecting) {
    return "Connecting";
  }

  return "Not connected";
}

export function getWalletReadyStateLabel(readyState: string) {
  switch (readyState) {
    case "Installed":
      return "Installed";
    case "Loadable":
      return "Open in app";
    case "NotDetected":
      return "Install needed";
    default:
      return readyState;
  }
}
