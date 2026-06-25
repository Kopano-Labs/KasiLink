"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Network, Shield, Wallet } from "lucide-react";
import {
  getWalletConnectionLabel,
  shortenWalletAddress,
  SOLANA_WALLET_ALLOWED_ADAPTERS,
  SOLANA_WALLET_CLUSTER,
  SOLANA_WALLET_ENDPOINT,
  SOLANA_WALLET_GUARDRAILS,
} from "@/lib/solana-wallet-spine";

type WalletCandidate = {
  id: "phantom" | "solflare" | "backpack";
  name: string;
  readyState: "Installed" | "NotDetected";
  provider?: InjectedSolanaProvider;
};

type InjectedSolanaProvider = {
  connect: (options?: Record<string, unknown>) => Promise<{
    publicKey?: { toBase58?: () => string; toString?: () => string };
  } | void>;
  disconnect?: () => Promise<void>;
  isConnected?: boolean;
  publicKey?: { toBase58?: () => string; toString?: () => string };
};

declare global {
  interface Window {
    backpack?: { solana?: InjectedSolanaProvider };
    phantom?: { solana?: InjectedSolanaProvider };
    solflare?: InjectedSolanaProvider;
  }
}

function detectWalletCandidates(): WalletCandidate[] {
  if (typeof window === "undefined") {
    return SOLANA_WALLET_ALLOWED_ADAPTERS.map((name) => ({
      id: name.toLowerCase() as WalletCandidate["id"],
      name,
      readyState: "NotDetected",
    }));
  }

  const phantom = window.phantom?.solana;
  const solflare = window.solflare;
  const backpack = window.backpack?.solana;

  return [
    {
      id: "phantom",
      name: "Phantom",
      provider: phantom,
      readyState: phantom ? "Installed" : "NotDetected",
    },
    {
      id: "solflare",
      name: "Solflare",
      provider: solflare,
      readyState: solflare ? "Installed" : "NotDetected",
    },
    {
      id: "backpack",
      name: "Backpack",
      provider: backpack,
      readyState: backpack ? "Installed" : "NotDetected",
    },
  ];
}

function readWalletAddress(provider?: InjectedSolanaProvider | null) {
  if (!provider?.publicKey) {
    return null;
  }

  if (typeof provider.publicKey.toBase58 === "function") {
    return provider.publicKey.toBase58();
  }

  if (typeof provider.publicKey.toString === "function") {
    return provider.publicKey.toString();
  }

  return null;
}

export default function LiteWalletPilotCard() {
  const [wallets, setWallets] = useState<WalletCandidate[]>([]);
  const [rpcStatus, setRpcStatus] = useState<"Checking" | "Ready" | "Delayed">("Checking");
  const [walletError, setWalletError] = useState<string | null>(null);
  const [connectingWalletId, setConnectingWalletId] = useState<WalletCandidate["id"] | null>(null);
  const [activeWalletId, setActiveWalletId] = useState<WalletCandidate["id"] | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    setWallets(detectWalletCandidates());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkRpc() {
      try {
        const response = await fetch(SOLANA_WALLET_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "getVersion",
          }),
        });

        if (!response.ok) {
          throw new Error(`RPC returned ${response.status}`);
        }

        if (!cancelled) {
          setRpcStatus("Ready");
        }
      } catch {
        if (!cancelled) {
          setRpcStatus("Delayed");
        }
      }
    }

    void checkRpc();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeWallet = useMemo(
    () => wallets.find((candidate) => candidate.id === activeWalletId) ?? null,
    [activeWalletId, wallets],
  );

  async function handleConnect(candidate: WalletCandidate) {
    if (!candidate.provider) {
      setWalletError(`${candidate.name} is not installed on this device yet.`);
      return;
    }

    setWalletError(null);
    setConnectingWalletId(candidate.id);

    try {
      const result = await candidate.provider.connect();
      const address =
        readWalletAddress({
          ...candidate.provider,
          publicKey: result && "publicKey" in result ? result.publicKey ?? candidate.provider.publicKey : candidate.provider.publicKey,
        }) ?? readWalletAddress(candidate.provider);

      setActiveWalletId(candidate.id);
      setConnectedAddress(address);
      setWallets(detectWalletCandidates());
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setConnectingWalletId(null);
    }
  }

  async function handleDisconnect() {
    if (!activeWallet?.provider?.disconnect) {
      setActiveWalletId(null);
      setConnectedAddress(null);
      return;
    }

    try {
      await activeWallet.provider.disconnect();
    } catch {
      // Keep the UI deterministic even if the wallet silently drops the session.
    } finally {
      setActiveWalletId(null);
      setConnectedAddress(null);
      setWallets(detectWalletCandidates());
    }
  }

  const installedWallets = wallets.filter((candidate) => candidate.readyState === "Installed");
  const connectionLabel = getWalletConnectionLabel(Boolean(connectedAddress), Boolean(connectingWalletId));

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <article className="feature-panel">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-primary">Wallet spine pilot</span>
          <span className="badge badge-secondary">{SOLANA_WALLET_CLUSTER}</span>
          <span className="badge badge-secondary">External custody</span>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-black text-on-background">
              Shared wallet connection for proof, not custody
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
              This is the first runtime slice of the Kopano Wallet Spine. Lite checks the devnet
              RPC, detects installed browser wallets, and lets one external wallet connect without
              adding any payment or chain-write path to KasiLink yet.
            </p>
          </div>

          {connectedAddress ? (
            <button type="button" className="btn btn-outline" onClick={() => void handleDisconnect()}>
              Disconnect wallet
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4">
            <p className="mini-stat-label">Status</p>
            <p className="mt-2 text-lg font-bold text-on-background">{connectionLabel}</p>
          </div>
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4">
            <p className="mini-stat-label">Wallet</p>
            <p className="mt-2 text-lg font-bold text-on-background">
              {activeWallet?.name ?? "External wallet"}
            </p>
          </div>
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4">
            <p className="mini-stat-label">Address</p>
            <p className="mt-2 text-lg font-bold text-on-background">
              {shortenWalletAddress(connectedAddress)}
            </p>
          </div>
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4">
            <p className="mini-stat-label">RPC</p>
            <p className="mt-2 text-lg font-bold text-on-background">{rpcStatus}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-5">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={18} />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">Guardrails</p>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-on-surface-variant">
              {SOLANA_WALLET_GUARDRAILS.map((guardrail) => (
                <li key={guardrail} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-success" size={16} />
                  <span>{guardrail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-5">
            <div className="flex items-center gap-2 text-primary">
              <Network size={18} />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                Installed wallets
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              {wallets.map((candidate) => (
                <div
                  key={candidate.id}
                  className="rounded-2xl border border-outline-variant/30 bg-background/50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-on-background">{candidate.name}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {candidate.readyState === "Installed"
                          ? "Installed on this device"
                          : "Install or open this wallet first"}
                      </p>
                    </div>
                    <span
                      className={
                        candidate.readyState === "Installed"
                          ? "badge badge-success"
                          : "badge badge-secondary"
                      }
                    >
                      {candidate.readyState}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => void handleConnect(candidate)}
                      disabled={candidate.readyState !== "Installed" || connectingWalletId !== null}
                    >
                      <Wallet size={16} />
                      {connectingWalletId === candidate.id ? "Connecting" : `Connect ${candidate.name}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {installedWallets.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                No supported Solana browser wallet is installed in this runtime yet. The spine is
                still valid: RPC proof is active, and the connect lane will work as soon as one of
                the supported wallets is present.
              </p>
            ) : null}
          </div>
        </div>

        {walletError ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-on-surface-variant">
            <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={16} />
            <span>{walletError}</span>
          </div>
        ) : null}
      </article>

      <aside className="kasi-card">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
          Why this first
        </p>
        <h3 className="mt-3 text-xl font-bold text-on-background">
          One wallet spine for the ecosystem
        </h3>
        <p className="mt-3 text-sm leading-7 text-on-surface-variant">
          KasiLink Lite is the proving ground. Once this lane is stable, the same spine can be
          reused by Five&apos;s Arena, Starfall proof surfaces, and future Kopano Labs MVPs without
          cloning wallet logic per product.
        </p>
        <div className="mt-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4">
          <p className="mini-stat-label">Current cluster</p>
          <p className="mt-2 font-bold text-on-background">{SOLANA_WALLET_CLUSTER}</p>
          <p className="mt-4 mini-stat-label">Endpoint</p>
          <p className="mt-2 break-all text-sm font-medium text-on-background">
            {SOLANA_WALLET_ENDPOINT}
          </p>
        </div>
      </aside>
    </div>
  );
}
