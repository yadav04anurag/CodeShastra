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

// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axiosClient from "../utils/axiosClient";
// import { Send, Bot, User } from 'lucide-react';

// function ChatAi({ problem }) {
//     const [messages, setMessages] = useState([
//         { 
//             role: 'model', 
//             parts: [{text: "Hello! I'm your AI assistant. How can I help you with this problem today?"}]
//         }
//     ]);
//     const [isLoading, setIsLoading] = useState(false);
//     const { register, handleSubmit, reset, formState: { errors } } = useForm();
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const onSubmit = async (data) => {
//         const userMessage = { role: 'user', parts: [{ text: data.message }] };
//         setMessages(prev => [...prev, userMessage]);
//         reset();
//         setIsLoading(true);

//         try {
//             const response = await axiosClient.post("/ai/chat", {
//                 messages: [...messages, userMessage],
//                 title: problem.title,
//                 description: problem.description,
//                 testCases: problem.visibleTestCases,
//                 startCode: problem.startCode
//             });

//             setMessages(prev => [...prev, { 
//                 role: 'model', 
//                 parts: [{ text: response.data.message }] 
//             }]);
//         } catch (error) {
//             console.error("API Error:", error);
//             setMessages(prev => [...prev, { 
//                 role: 'model', 
//                 parts: [{ text: "⚠️ Sorry, I'm having trouble responding. Please try again." }]
//             }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Parse AI responses with markdown-like formatting
//     const renderMessageContent = (text) => {
//         return text.split('\n').map((line, i) => {
//             // Handle numbered lists
//             if (/^\d+\.\s/.test(line)) {
//                 const parts = line.split(/(\*\*.+?\*\*)/g);
//                 return (
//                     <div key={i} className="flex items-start mb-1.5">
//                         <span className="mr-2 text-primary font-semibold">
//                             {line.match(/^\d+/)[0]}.
//                         </span>
//                         <span>
//                             {parts.map((part, j) => 
//                                 part.startsWith('**') && part.endsWith('**') ? (
//                                     <strong key={j} className="text-accent">
//                                         {part.slice(2, -2)}
//                                     </strong>
//                                 ) : (
//                                     part
//                                 )
//                             )}
//                         </span>
//                     </div>
//                 );
//             }
            
//             // Handle bold text
//             const segments = line.split(/(\*\*.+?\*\*)/g);
//             return (
//                 <div key={i} className="mb-1.5 last:mb-0">
//                     {segments.map((segment, j) => 
//                         segment.startsWith('**') && segment.endsWith('**') ? (
//                             <strong key={j} className="text-accent">
//                                 {segment.slice(2, -2)}
//                             </strong>
//                         ) : (
//                             segment
//                         )
//                     )}
//                 </div>
//             );
//         });
//     };

//     return (
//         <div className="flex flex-col h-full max-h-[80vh] min-h-[500px] bg-base-100 rounded-xl border border-base-300 overflow-hidden shadow-lg">
//             {/* Chat Header */}
//             <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-content p-4 flex items-center space-x-3">
//                 <Bot size={24} className="text-accent-content" />
//                 <div>
//                     <h3 className="text-lg font-bold">Problem Solving Assistant</h3>
//                     <p className="text-xs opacity-80">{problem.title}</p>
//                 </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-base-100 to-base-200/50">
//                 {messages.map((msg, index) => (
//                     <div 
//                         key={index} 
//                         className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                     >
//                         <div className={`max-w-[85%] flex ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
//                             <div className={`flex-shrink-0 mt-2 ${msg.role === "user" ? "ml-3" : "mr-3"}`}>
//                                 {msg.role === "user" ? (
//                                     <div className="bg-primary text-primary-content rounded-full p-1.5">
//                                         <User size={18} />
//                                     </div>
//                                 ) : (
//                                     <div className="bg-secondary text-secondary-content rounded-full p-1.5">
//                                         <Bot size={18} />
//                                     </div>
//                                 )}
//                             </div>
//                             <div className={`
//                                 rounded-2xl px-4 py-3 shadow
//                                 ${msg.role === "user" 
//                                     ? "bg-primary text-primary-content rounded-tr-none" 
//                                     : "bg-base-200 text-base-content rounded-tl-none border border-base-300"}
//                             `}>
//                                 <div className="prose prose-sm max-w-none">
//                                     {renderMessageContent(msg.parts[0].text)}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
                
//                 {isLoading && (
//                     <div className="flex justify-start">
//                         <div className="max-w-[85%] flex">
//                             <div className="mr-3 flex-shrink-0 mt-2">
//                                 <div className="bg-secondary text-secondary-content rounded-full p-1.5">
//                                     <Bot size={18} />
//                                 </div>
//                             </div>
//                             <div className="bg-base-200 text-base-content rounded-2xl rounded-tl-none px-4 py-3 border border-base-300">
//                                 <div className="flex space-x-2">
//                                     <div className="w-2 h-2 rounded-full bg-base-content animate-bounce"></div>
//                                     <div className="w-2 h-2 rounded-full bg-base-content animate-bounce delay-100"></div>
//                                     <div className="w-2 h-2 rounded-full bg-base-content animate-bounce delay-200"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <form 
//                 onSubmit={handleSubmit(onSubmit)} 
//                 className="sticky bottom-0 p-4 bg-base-100 border-t border-base-300"
//             >
//                 <div className="flex items-center">
//                     <input 
//                         placeholder="Ask about the problem..." 
//                         className="input input-bordered flex-1 focus:ring-2 focus:ring-primary focus:border-transparent"
//                         disabled={isLoading}
//                         {...register("message", { 
//                             required: "Message is required", 
//                             minLength: { 
//                                 value: 2, 
//                                 message: "Message must be at least 2 characters" 
//                             }
//                         })}
//                     />
//                     <button 
//                         type="submit" 
//                         className="btn btn-primary ml-3 shadow-md"
//                         disabled={isLoading || errors.message}
//                     >
//                         {isLoading ? (
//                             <span className="loading loading-spinner"></span>
//                         ) : (
//                             <Send size={18} />
//                         )}
//                     </button>
//                 </div>
//                 {errors.message && (
//                     <p className="mt-2 text-error text-sm">{errors.message.message}</p>
//                 )}
//             </form>
//         </div>
//     );
// }

// export default ChatAi;

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Copy, Lightbulb, Cpu, Gauge, Code } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
    const [copied, setCopied] = useState(null);

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

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    const renderMessageContent = (text) => {
        // Detect code blocks
        const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Add text before code block
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index)
                });
            }

            // Add code block
            parts.push({
                type: 'code',
                language: match[1] || 'python',
                content: match[2].trim()
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex)
            });
        }

        return parts.map((part, index) => {
            if (part.type === 'code') {
                return (
                    <div key={index} className="relative my-4 rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-900 px-4 py-2 text-xs text-gray-400">
                            <span>{part.language || 'code'}</span>
                            <button 
                                className="flex items-center gap-1 hover:text-gray-200 transition-colors"
                                onClick={() => copyToClipboard(part.content, index)}
                            >
                                <Copy size={14} />
                                {copied === index ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <SyntaxHighlighter 
                            language={part.language || 'python'} 
                            style={atomOneDark}
                            customStyle={{ 
                                margin: 0, 
                                borderRadius: '0 0 0.5rem 0.5rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            {part.content}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            // Process text content with section detection
            return (
                <div key={index} className="text-gray-100">
                    {part.content.split('\n\n').map((paragraph, pIndex) => {
                        // Remove markdown formatting
                        const cleanParagraph = paragraph
                            .replace(/\*\*/g, '')
                            .replace(/^\d+\.\s*/gm, '');
                        
                        // Detect section headers
                        const approachMatch = cleanParagraph.match(/Approach:(.*)/s);
                        const algorithmMatch = cleanParagraph.match(/Algorithm:(.*)/s);
                        const codeMatch = cleanParagraph.match(/Code:(.*)/s);
                        const complexityMatch = cleanParagraph.match(/Time and Space Complexity:(.*)/s);
                        const explanationMatch = cleanParagraph.match(/Explanation:(.*)/s);
                        
                        // Handle section headers
                        if (approachMatch) {
                            return (
                                <div key={pIndex} className="mb-5">
                                    <div className="flex items-center mb-3">
                                        <Lightbulb size={18} className="text-indigo-400 mr-2" />
                                        <h4 className="text-lg font-bold text-indigo-300">Approach</h4>
                                    </div>
                                    <p className="mb-2">{approachMatch[1].trim()}</p>
                                </div>
                            );
                        }
                        
                        if (algorithmMatch) {
                            return (
                                <div key={pIndex} className="mb-5">
                                    <div className="flex items-center mb-3">
                                        <Cpu size={18} className="text-indigo-400 mr-2" />
                                        <h4 className="text-lg font-bold text-indigo-300">Algorithm</h4>
                                    </div>
                                    <div className="ml-5 space-y-2">
                                        {algorithmMatch[1].trim().split('\n').map((step, sIndex) => (
                                            <div key={sIndex} className="flex">
                                                <span className="text-indigo-400 font-medium mr-2">{sIndex + 1}.</span>
                                                <span>{step.trim()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        
                        if (codeMatch) {
                            // Code section is already handled by code block detection
                            return null;
                        }
                        
                        if (complexityMatch) {
                            return (
                                <div key={pIndex} className="mb-5">
                                    <div className="flex items-center mb-1 mt-1">
                                        <Gauge size={20} className="text-indigo-400 mr-2" />
                                        <h4 className="text-lg font-bold text-indigo-300">Time and Space Complexity</h4>
                                    </div>
                                    <div className="ml-5 space-y-1">
                                        {complexityMatch[1].trim().split('\n').map((line, lIndex) => (
                                            <div key={lIndex} className="flex items-baseline">
                                                <span className="text-gray-400 mr-2">•</span>
                                                <span>{line.trim()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        
                        if (explanationMatch) {
                            return (
                                <div key={pIndex} className="mb-5">
                                    <div className="flex items-center mb-3">
                                        <Code size={18} className="text-indigo-400 mr-2" />
                                        <h4 className="text-lg font-bold text-indigo-300">Explanation</h4>
                                    </div>
                                    <p className="mb-2">{explanationMatch[1].trim()}</p>
                                </div>
                            );
                        }
                        
                        // Regular paragraphs
                        return (
                            <div key={pIndex} className="mb-4">
                                {cleanParagraph.split('\n').map((line, lIndex) => (
                                    <p key={lIndex} className="mb-2 last:mb-0">{line}</p>
                                ))}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh] min-h-[500px] bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 p-4 flex items-center space-x-3">
                <Bot size={24} className="text-indigo-200" />
                <div>
                    <h3 className="text-lg font-bold text-white">Problem Solving Assistant</h3>
                    <p className="text-xs text-indigo-200">{problem.title}</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-900 to-gray-950">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[90%] flex ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`flex-shrink-0 mt-2 ${msg.role === "user" ? "ml-3" : "mr-3"}`}>
                                {msg.role === "user" ? (
                                    <div className="bg-indigo-600 text-white rounded-full p-2">
                                        <User size={16} />
                                    </div>
                                ) : (
                                    <div className="bg-indigo-800 text-indigo-200 rounded-full p-2">
                                        <Bot size={16} />
                                    </div>
                                )}
                            </div>
                            <div className={`
                                rounded-2xl px-4 py-3 max-w-full
                                ${msg.role === "user" 
                                    ? "bg-indigo-700 text-white rounded-tr-none" 
                                    : "bg-gray-800 text-gray-100 rounded-tl-none"}
                            `}>
                                {renderMessageContent(msg.parts[0].text)}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[90%] flex">
                            <div className="mr-3 flex-shrink-0 mt-2">
                                <div className="bg-indigo-800 text-indigo-200 rounded-full p-2">
                                    <Bot size={16} />
                                </div>
                            </div>
                            <div className="bg-gray-800 text-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200"></div>
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
                className="sticky bottom-0 p-4 bg-gray-900 border-t border-gray-700"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask about the problem..." 
                        className="input flex-1 bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white ml-3 shadow-md"
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
                    <p className="mt-2 text-red-400 text-sm">{errors.message.message}</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;