import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({ problem, currentCode, currentLanguage }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: `Hi! I'm your DSA tutor for "${problem?.title}". I can see your current code in the editor. Ask me for hints, code review, or the optimal solution!` }] }
    ]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const updatedMessages = [...messages, { role: 'user', parts: [{ text: data.message }] }];
        setMessages(updatedMessages);
        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: updatedMessages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode,
                // ✅ Editor ka current code aur language automatically jaayega
                currentCode: currentCode,
                currentLanguage: currentLanguage
            });

            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }]
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Something went wrong. Please try again." }]
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-bubble bg-base-200 text-base-content whitespace-pre-wrap">
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Ask me anything..."
                        className="input input-bordered flex-1"
                        disabled={loading}
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary ml-2"
                        disabled={loading}
                    >
                        {loading
                            ? <span className="loading loading-spinner loading-xs" />
                            : <Send size={20} />
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;
