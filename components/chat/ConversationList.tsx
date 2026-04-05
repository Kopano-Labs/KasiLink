"use client";

interface Conversation {
  _id: string;
  gigTitle: string;
  lastMessageAt: string;
  lastMessageText?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center">
        <p className="text-sm text-on-surface-variant">No conversations yet.</p>
        <p className="mt-2 text-xs text-outline">
          Start a chat from a gig detail page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isActive = conversation._id === activeConversationId;
        return (
          <button
            key={conversation._id}
            onClick={() => onSelect(conversation._id)}
            className={`w-full rounded-xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-primary bg-primary-container/30"
                : "border-outline-variant bg-surface hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{conversation.gigTitle}</p>
                <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">
                  {conversation.lastMessageText || "No messages yet"}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-outline">
                {new Date(conversation.lastMessageAt).toLocaleDateString()}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
