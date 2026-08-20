import { MarkContactMessageReadButton } from "@/components/admin/MarkContactMessageReadButton";
import { ApiError, apiFetch } from "@/lib/api";
import type { ContactMessage } from "@/lib/types";

function formatReceivedAt(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminMessagesPage() {
  let messages: ContactMessage[] = [];
  let errorMessage: string | null = null;

  try {
    messages = await apiFetch<ContactMessage[]>("/admin/contact-messages");
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Unable to load messages.";
  }

  const unreadCount = messages.filter((message) => !message.readAt).length;

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Inbox
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Messages
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {unreadCount === 0
            ? "Contact form submissions from the storefront."
            : `${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}.`}
        </p>
      </div>

      {errorMessage ? (
        <p className="mt-8 text-muted-foreground" role="alert">
          {errorMessage}
        </p>
      ) : messages.length === 0 ? (
        <div className="mt-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            No messages yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium tracking-tight">{message.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${message.email}`}
                      className="hover:text-foreground"
                    >
                      {message.email}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatReceivedAt(message.createdAt)}
                    {message.readAt ? " · Read" : " · Unread"}
                  </p>
                </div>
                {message.readAt ? null : (
                  <MarkContactMessageReadButton messageId={message.id} />
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
