"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SkinSelector, { type SkinId } from "@/components/chat-skins/SkinSelector";
import WhatsAppSkin from "@/components/chat-skins/WhatsAppSkin";
import DiscordSkin from "@/components/chat-skins/DiscordSkin";
import InstagramSkin from "@/components/chat-skins/InstagramSkin";
import ConversationList from "@/components/chat/ConversationList";

interface Conversation {
  _id: string;
  gigId: string;
  gigTitle: string;
  lastMessageAt: string;
  lastMessageText?: string;
  participants: string[];
}

const SKIN_LABELS: Record<SkinId, string> = {
  default: "Default",
  whatsapp: "WhatsApp",
  discord: "Discord",
  instagram: "Instagram",
};

export default function ChatPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [activeSkin, setActiveSkin] = useState<SkinId>("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;

    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const nextConversations = (data.conversations ?? []) as Conversation[];
        setConversations(nextConversations);
        if (!activeConversationId && nextConversations.length > 0) {
          setActiveConversationId(nextConversations[0]._id);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isSignedIn, activeConversationId]);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === activeConversationId,
      ) ?? null,
    [conversations, activeConversationId],
  );

  const skinContent = useMemo(() => {
    if (!activeConversation) return null;

    if (activeSkin === "whatsapp") {
      return (
        <WhatsAppSkin
          conversationId={activeConversation._id}
          gigTitle={activeConversation.gigTitle}
        />
      );
    }

    if (activeSkin === "discord") {
      return (
        <DiscordSkin
          conversationId={activeConversation._id}
          gigTitle={activeConversation.gigTitle}
        />
      );
    }

    if (activeSkin === "instagram") {
      return (
        <InstagramSkin
          conversationId={activeConversation._id}
          gigTitle={activeConversation.gigTitle}
        />
      );
    }

    return null;
  }, [activeConversation, activeSkin]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-primary-container px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Chat
          </p>
          <h1 className="font-headline text-3xl font-bold">In-App Messaging</h1>
          <p className="max-w-2xl text-sm text-on-surface-variant">
            Switch between community chat skins while keeping the default KasiLink
            experience intact.
          </p>
        </div>
        <div className="text-sm text-on-surface-variant">
          Signed in as {user?.firstName || user?.username || "member"}
        </div>
      </div>

      <div className="mb-6">
        <SkinSelector activeSkin={activeSkin} onSkinChange={setActiveSkin} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="kasi-card h-fit">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Conversations</h2>
            <p className="text-sm text-on-surface-variant">
              Recent gig conversations and community follow-ups.
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">
              Loading conversations...
            </p>
          ) : (
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={setActiveConversationId}
            />
          )}
        </aside>

        <section className="space-y-4">
          {activeConversation ? (
            <>
              <div className="kasi-card border border-outline-variant/60">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-outline">
                      Active skin
                    </p>
                    <h2 className="text-xl font-bold">
                      {SKIN_LABELS[activeSkin]} on {activeConversation.gigTitle}
                    </h2>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Conversation ID: {activeConversation._id}
                  </p>
                </div>
              </div>

              {activeSkin === "default" ? (
                <div className="kasi-card min-h-[70vh]">
                  <div className="mb-4 border-b border-outline-variant pb-4">
                    <p className="text-sm text-outline">Default chat view</p>
                    <h3 className="text-lg font-bold">{activeConversation.gigTitle}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    The themed chat skins are available above. Select WhatsApp,
                    Discord, or Instagram to render the alternate layout for this
                    conversation.
                  </p>
                </div>
              ) : (
                skinContent
              )}
            </>
          ) : (
            <div className="kasi-card min-h-[70vh] flex items-center justify-center text-center">
              <div>
                <h2 className="text-xl font-bold">No conversation selected</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Pick a conversation from the list to open the chat skins.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
