import { useState, useEffect, useRef } from "react";

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.GEMINI_API_KEY;

const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-1",
  sender: "bot",
  text: "Namaste! 🙏 I am your **GovInterop AI Citizen Assistant**.\n\nI can help you with:\n• **Scheme Tracking**: PMAY Housing, Childcare Allowance, Skill Grants\n• **DPDP-2023 Consent**: Granting or revoking department data sharing\n• **Document Auto-Fetch**: Income Certificates, 7/12 records, DigiLocker, Driving License\n\nHow may I assist you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  isStreaming: false,
};

const SUGGESTED_QUESTIONS = [
  "🌾 Check PMAY Housing scheme status",
  "🛡️ How do I revoke data consent under DPDP?",
  "📄 How does instant Income Certificate fetch work?",
  "🚗 Can I link my Driving License via Sarathi?",
];

export default function CitizenChatbot({ onNavigateSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Helper to simulate smooth token-by-token streaming if fallback response is needed
  const streamLocalText = async (botMsgId, fullText) => {
    const words = fullText.split(" ");
    let current = "";
    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? " " : "") + words[i];
      setMessages((prev) =>
        prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: current } : msg))
      );
      await new Promise((r) => setTimeout(r, 25));
    }
    setMessages((prev) =>
      prev.map((msg) => (msg.id === botMsgId ? { ...msg, isStreaming: false } : msg))
    );
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: false,
    };

    const botMsgId = `bot-${Date.now()}`;
    const initialBotMessage = {
      id: botMsgId,
      sender: "bot",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, initialBotMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      // Build conversation context
      const historyContext = messages
        .filter((m) => m.text)
        .slice(-6)
        .map((m) => `${m.sender === "user" ? "Citizen" : "Assistant"}: ${m.text}`)
        .join("\n");

      const promptText = `You are the official GovInterop Citizen AI Assistant for the Maharashtra & Digital India interoperability platform.
Guidelines:
1. Provide accurate, citizen-friendly guidance on welfare schemes (PMAY Housing, Childcare Allowance, Skill Development), DPDP-2023 data consent rules, and cross-department automated data fetches (DigiLocker, 7/12 Land Records, Income Certificates, Driving License).
2. Answer politely, concisely, and with structured bullet points where helpful.
3. If asked in Marathi or Hindi, reply in the same language. Otherwise reply in clear English.

Conversation Context:
${historyContext}

Citizen: ${query}
Assistant:`;

      // Real-time SSE streaming request to Gemini API
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: promptText }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini streaming error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.slice(6);
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (chunk) {
                accumulatedText += chunk;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId ? { ...msg, text: accumulatedText } : msg
                  )
                );
              }
            } catch (e) {
              // Partial JSON, continue accumulating
            }
          }
        }
      }

      // Mark streaming completed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err) {
      console.warn("Gemini streaming failed or offline, streaming smart fallback:", err);

      let fallbackText =
        "Thank you for reaching out. Your request has been recorded. You can manage your applications, consents, and document fetches directly from the **GovInterop Citizen Dashboard** sections above.";

      const qLower = query.toLowerCase();
      if (qLower.includes("pmay") || qLower.includes("housing")) {
        fallbackText =
          "🏠 **PMAY Housing Scheme (HSA-2026-04821)**:\nYour application is currently **Under Review** (Stage 2 Inspection). Verification is actively in progress with the MHADA case officer.";
      } else if (qLower.includes("consent") || qLower.includes("dpdp") || qLower.includes("revoke")) {
        fallbackText =
          "🛡️ **DPDP-2023 Consent Management**:\nYou have full control under the Digital Personal Data Protection Act 2023. You can review active consents and revoke permissions anytime with 1 click in the **Consent Center**.";
      } else if (qLower.includes("income") || qLower.includes("fetch") || qLower.includes("certificate")) {
        fallbackText =
          "📄 **Income Certificate Auto-Fetch**:\nGovInterop connects directly to Tahsil / MahaOnline. Your Income Certificate (`MH-REV-INC-2026-91823`) is ready for instant automated verification with zero paperwork.";
      } else if (qLower.includes("license") || qLower.includes("sarathi") || qLower.includes("driving")) {
        fallbackText =
          "🚗 **Driving License Linkage**:\nYour smart card Driving License is synced via **Sarathi 4.0 (RTO Pune MH-12)** and acts as verified Identity & Address proof.";
      }

      await streamLocalText(botMsgId, fallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── 1. Floating Static Chatbot Button (Bottom Right) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Unread Message Tooltip Prompt when closed */}
        {!isOpen && hasUnread && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-[#182c25] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl border border-[#d6f06e]/30 cursor-pointer flex items-center gap-2 animate-bounce hover:bg-[#234337] transition-all"
          >
            <span className="text-sm">👋</span>
            <span>Ask GovInterop AI Assistant</span>
          </button>
        )}

        {/* Circular Launch Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-14 h-14 rounded-full bg-gradient-to-br from-[#182c25] to-[#2a4c3f] text-[#d6f06e] border-2 border-[#d6f06e] shadow-2xl cursor-pointer grid place-items-center text-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
          title={isOpen ? "Close Assistant" : "Open GovInterop AI Assistant"}
          aria-label="Toggle GovInterop Citizen Chatbot"
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>

      {/* ── 2. Floating Chat Window ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] max-w-[420px] h-[72vh] max-h-[580px] min-h-[440px] bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#182c25] to-[#234337] text-white flex items-center justify-between border-b border-[#2d5546]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#d6f06e] text-[#182c25] grid place-items-center text-lg font-extrabold shadow-sm">
                🤖
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  GovInterop Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm" />
                </div>
                <div className="text-[10px] text-[#a9cbbd] font-medium">
                  ⚡ Real-Time Streaming AI · DPDP-2023
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#d6f06e] text-lg hover:bg-white/10 rounded-md p-1 transition-colors"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#f8faf7] flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                    msg.sender === "user"
                      ? "rounded-[14px_14px_2px_14px] bg-[#182c25] text-white"
                      : "rounded-[14px_14px_14px_2px] bg-white text-[#172b22] border border-[#e2ece0]"
                  }`}
                >
                  {msg.text ? (
                    msg.text
                  ) : msg.isStreaming ? (
                    <span className="text-[#748a7e] italic inline-flex items-center gap-1">
                      Thinking...
                    </span>
                  ) : null}

                  {msg.isStreaming && msg.text && (
                    <span className="inline-block w-1.5 h-3 bg-[#182c25] ml-1 align-middle animate-pulse" />
                  )}
                </div>
                <span className="text-[9px] text-[#8a9e92] px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Suggested Chips when only welcome message */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-[#617b6e]">
                  Suggested Quick Queries:
                </span>
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-left px-3 py-2 rounded-lg bg-white border border-[#cfe0cb] text-[#182c25] text-[11.5px] font-semibold hover:bg-[#eef5eb] hover:border-[#27503c] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#e2eade] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, consents, documents..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-lg border border-[#cbdad0] text-xs bg-[#fcfdfc] text-[#182c25] focus:outline-none focus:border-[#182c25] focus:ring-1 focus:ring-[#182c25] transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-lg grid place-items-center text-sm font-bold text-white transition-all ${
                input.trim() && !isLoading
                  ? "bg-[#182c25] hover:bg-[#234337] cursor-pointer shadow-sm"
                  : "bg-[#cdd9d2] cursor-not-allowed"
              }`}
              title="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
