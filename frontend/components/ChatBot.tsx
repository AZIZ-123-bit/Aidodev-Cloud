"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/api";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: string;
}

/**
 * ChatBot — Floating chat widget with message bubbles,
 * typing indicator, and smooth animations.
 */
export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Hello! 👋 I'm your SmartTravelAI assistant. Ask me anything about destinations, packing tips, budgets, or weather!",
            sender: "bot",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: "user",
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Simulate a slight delay for realism
            await new Promise((r) => setTimeout(r, 800));
            const res = await sendChatMessage(userMsg.text);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res.reply,
                sender: "bot",
                timestamp: res.timestamp,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I couldn't connect to the server. Make sure the backend is running! 🔌",
                sender: "bot",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* ── Chat Window ── */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] glass-strong rounded-3xl flex flex-col overflow-hidden animate-scale-in shadow-2xl shadow-black/30">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <span className="text-sm">🤖</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-white/90">
                                Travel Assistant
                            </p>
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                Online
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                    } animate-fade-in`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === "user"
                                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-md"
                                            : "bg-white/[0.07] text-white/80 rounded-bl-md border border-white/5"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white/[0.07] rounded-2xl rounded-bl-md px-5 py-3 border border-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-white/40 typing-dot" />
                                        <div className="w-2 h-2 rounded-full bg-white/40 typing-dot" />
                                        <div className="w-2 h-2 rounded-full bg-white/40 typing-dot" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/5">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about travel..."
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-orange-500/50 transition-all duration-200"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-30 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20"
                            >
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Floating Chat Button ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen
                        ? "bg-white/10 rotate-0 shadow-none"
                        : "bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 animate-gentle-pulse"
                    }`}
                aria-label="Toggle chat"
            >
                {isOpen ? (
                    <svg
                        className="w-5 h-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                ) : (
                    <span className="text-xl">💬</span>
                )}
            </button>
        </>
    );
}
