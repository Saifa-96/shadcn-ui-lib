import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";

const messages = [
  { id: 1, role: "user", content: "Hey, can you summarize the Q3 report?" },
  { id: 2, role: "assistant", content: "Revenue grew 12% QoQ, driven by enterprise renewals." },
  { id: 3, role: "assistant", content: "Churn dropped to 1.8%, our lowest this year." },
  { id: 4, role: "user", content: "Nice. What about the new dashboard?" },
  { id: 5, role: "assistant", content: "Rollout starts Monday, with a beta invite for your team." },
  { id: 6, role: "assistant", content: "I will share the link here once it is live." },
] as const;

export function MessageScrollerSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Message Scroller</h2>
      <div className="flex h-80 max-w-md flex-col rounded-lg border border-border p-2">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent>
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={String(message.id)}
                    scrollAnchor={message.role === "user"}
                  >
                    <Message align={message.role === "user" ? "end" : "start"} className="py-1.5">
                      <MessageAvatar>
                        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                          {message.role === "user" ? "ME" : "AI"}
                        </span>
                      </MessageAvatar>
                      <MessageContent>
                        <Bubble variant={message.role === "user" ? "default" : "secondary"}>
                          <BubbleContent>{message.content}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    </section>
  );
}
