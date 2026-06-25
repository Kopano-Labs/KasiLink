import { describe, expect, it } from "vitest";
import {
  getWalletConnectionLabel,
  getWalletReadyStateLabel,
  shortenWalletAddress,
  SOLANA_WALLET_CLUSTER,
} from "@/lib/solana-wallet-spine";

describe("solana wallet spine helpers", () => {
  it("stays locked to devnet for the first tranche", () => {
    expect(SOLANA_WALLET_CLUSTER).toBe("devnet");
  });

  it("shortens long wallet addresses for compact UI", () => {
    expect(shortenWalletAddress("ABCDEFGH12345678", 4)).toBe("ABCD...5678");
    expect(shortenWalletAddress(null)).toBe("Not connected");
  });

  it("maps connection states to user-facing labels", () => {
    expect(getWalletConnectionLabel(true, false)).toBe("Connected");
    expect(getWalletConnectionLabel(false, true)).toBe("Connecting");
    expect(getWalletConnectionLabel(false, false)).toBe("Not connected");
  });

  it("normalizes wallet readiness labels", () => {
    expect(getWalletReadyStateLabel("Installed")).toBe("Installed");
    expect(getWalletReadyStateLabel("Loadable")).toBe("Open in app");
    expect(getWalletReadyStateLabel("NotDetected")).toBe("Install needed");
  });
});
