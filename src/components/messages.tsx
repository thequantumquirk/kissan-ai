import { MessageType } from "@/types/MessageType";

export default function MessagesSection({
  messages,
}: {
  messages: MessageType[];
}) {
  return (
    <div className="w-[75vw] h-[75vh] flex flex-col gap-2 bg-foreground/10 px-8 py-4 rounded-lg overflow-y-scroll">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${
            message.role === "assistant"
              ? "w-full flex justify-start"
              : "w-full flex justify-end"
          }`}
        >
          <div
            className={`${
              message.role === "assistant"
                ? "bg-background"
                : "text-white bg-primary"
            } flex justify-end items-center rounded-lg p-2 w-fit`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
}
