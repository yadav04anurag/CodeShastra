// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axiosClient from "../utils/axiosClient";
// import { Send } from 'lucide-react';

// function ChatAi({problem}) {
//     const [messages, setMessages] = useState([
//         { role: 'model', parts:[{text: "Hi, How are you"}]},
//         { role: 'user', parts:[{text: "I am Good"}]}
//     ]);

//     const { register, handleSubmit, reset,formState: {errors} } = useForm();
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const onSubmit = async (data) => {
        
//         setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
//         reset();

//         try {
            
//             const response = await axiosClient.post("/ai/chat", {
//                 messages:messages,
//                 title:problem.title,
//                 description:problem.description,
//                 testCases: problem.visibleTestCases,
//                 startCode:problem.startCode
//             });

           
//             setMessages(prev => [...prev, { 
//                 role: 'model', 
//                 parts:[{text: response.data.message}] 
//             }]);
//         } catch (error) {
//             console.error("API Error:", error);
//             setMessages(prev => [...prev, { 
//                 role: 'model', 
//                 parts:[{text: "Error from AI Chatbot"}]
//             }]);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map((msg, index) => (
//                     <div 
//                         key={index} 
//                         className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
//                     >
//                         <div className="chat-bubble bg-base-200 text-base-content">
//                             {msg.parts[0].text}
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>
//             <form 
//                 onSubmit={handleSubmit(onSubmit)} 
//                 className="sticky bottom-0 p-4 bg-base-100 border-t"
//             >
//                 <div className="flex items-center">
//                     <input 
//                         placeholder="Ask me anything" 
//                         className="input input-bordered flex-1" 
//                         {...register("message", { required: true, minLength: 2 })}
//                     />
//                     <button 
//                         type="submit" 
//                         className="btn btn-ghost ml-2"
//                         disabled={errors.message}
//                     >
//                         <Send size={20} />
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default ChatAi;

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { 
            role: 'model', 
            parts: [{text: "Hello! I'm your AI assistant. How can I help you with this problem today?"}]
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: response.data.message }] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: "⚠️ Sorry, I'm having trouble responding. Please try again." }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Parse AI responses with markdown-like formatting
    const renderMessageContent = (text) => {
        return text.split('\n').map((line, i) => {
            // Handle numbered lists
            if (/^\d+\.\s/.test(line)) {
                const parts = line.split(/(\*\*.+?\*\*)/g);
                return (
                    <div key={i} className="flex items-start mb-1.5">
                        <span className="mr-2 text-primary font-semibold">
                            {line.match(/^\d+/)[0]}.
                        </span>
                        <span>
                            {parts.map((part, j) => 
                                part.startsWith('**') && part.endsWith('**') ? (
                                    <strong key={j} className="text-accent">
                                        {part.slice(2, -2)}
                                    </strong>
                                ) : (
                                    part
                                )
                            )}
                        </span>
                    </div>
                );
            }
            
            // Handle bold text
            const segments = line.split(/(\*\*.+?\*\*)/g);
            return (
                <div key={i} className="mb-1.5 last:mb-0">
                    {segments.map((segment, j) => 
                        segment.startsWith('**') && segment.endsWith('**') ? (
                            <strong key={j} className="text-accent">
                                {segment.slice(2, -2)}
                            </strong>
                        ) : (
                            segment
                        )
                    )}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh] min-h-[500px] bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-lg">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-content p-4 flex items-center space-x-3">
                <Bot size={24} className="text-accent-content" />
                <div>
                    <h3 className="text-lg font-bold">Problem Solving Assistant</h3>
                    <p className="text-xs opacity-80">{problem.title}</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-base-100 to-base-200/50">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] flex ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`flex-shrink-0 mt-2 ${msg.role === "user" ? "ml-3" : "mr-3"}`}>
                                {msg.role === "user" ? (
                                    <div className="bg-primary text-primary-content rounded-full p-1.5">
                                        <User size={18} />
                                    </div>
                                ) : (
                                    <div className="bg-secondary text-secondary-content rounded-full p-1.5">
                                        <Bot size={18} />
                                    </div>
                                )}
                            </div>
                            <div className={`
                                rounded-2xl px-4 py-3 shadow
                                ${msg.role === "user" 
                                    ? "bg-primary text-primary-content rounded-tr-none" 
                                    : "bg-base-200 text-base-content rounded-tl-none border border-base-300"}
                            `}>
                                <div className="prose prose-sm max-w-none">
                                    {renderMessageContent(msg.parts[0].text)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] flex">
                            <div className="mr-3 flex-shrink-0 mt-2">
                                <div className="bg-secondary text-secondary-content rounded-full p-1.5">
                                    <Bot size={18} />
                                </div>
                            </div>
                            <div className="bg-base-200 text-base-content rounded-2xl rounded-tl-none px-4 py-3 border border-base-300">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-base-content animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-base-content animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 rounded-full bg-base-content animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t border-base-300"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask about the problem..." 
                        className="input input-bordered flex-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={isLoading}
                        {...register("message", { 
                            required: "Message is required", 
                            minLength: { 
                                value: 2, 
                                message: "Message must be at least 2 characters" 
                            }
                        })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary ml-3 shadow-md"
                        disabled={isLoading || errors.message}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
                {errors.message && (
                    <p className="mt-2 text-error text-sm">{errors.message.message}</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;