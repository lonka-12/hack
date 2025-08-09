import React, { useState } from "react";
import { Bot, MessageCircle } from "lucide-react";
import type { ChatMessage } from "../types";
import { sendMessageToAI } from "../utils/api";

interface ChatAssistantProps {
  selectedState: string;
  cancerType: string;
  stage: string;
  insuranceType: string;
}

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string): React.ReactNode => {
  if (!text) return text;

  // Split text into lines to handle line breaks
  const lines = text.split("\n");
  const processedLines: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (line.trim() === "") {
      // End current list if we're in one
      if (inList && listItems.length > 0) {
        processedLines.push(
          <ul key={`list-${lineIndex}`} className="ml-4 list-disc space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      } else {
        // Add line break for empty lines
        processedLines.push(<br key={`line-${lineIndex}`} />);
      }
      return;
    }

    // Handle list items
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const listContent = line.replace(/^[-*]\s*/, "");
      listItems.push(
        <li key={`list-item-${lineIndex}`}>
          <span>{parseInlineMarkdown(listContent)}</span>
        </li>
      );
      inList = true;
    } else {
      // End current list if we're in one
      if (inList && listItems.length > 0) {
        processedLines.push(
          <ul key={`list-${lineIndex}`} className="ml-4 list-disc space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      processedLines.push(
        <span key={`line-${lineIndex}`}>{parseInlineMarkdown(line)}</span>
      );
    }

    // Add line break if not the last line and not in a list
    if (lineIndex < lines.length - 1 && !inList) {
      processedLines.push(<br key={`break-${lineIndex}`} />);
    }
  });

  // Handle any remaining list items
  if (inList && listItems.length > 0) {
    processedLines.push(
      <ul key="list-final" className="ml-4 list-disc space-y-1">
        {listItems}
      </ul>
    );
  }

  return <>{processedLines}</>;
};

// Helper function to parse inline markdown (bold and italic)
const parseInlineMarkdown = (text: string): React.ReactNode => {
  // First, handle bold text (**text**)
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  const processedBoldParts: React.ReactNode[] = [];

  boldParts.forEach((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // This is bold text
      const boldContent = part.slice(2, -2);
      processedBoldParts.push(
        <strong key={`bold-${index}`} className="font-bold text-white">
          {parseItalicMarkdown(boldContent)}
        </strong>
      );
    } else {
      // Regular text, check for italic formatting
      processedBoldParts.push(parseItalicMarkdown(part));
    }
  });

  return <>{processedBoldParts}</>;
};

// Helper function to parse italic markdown (*text*)
const parseItalicMarkdown = (text: string): React.ReactNode => {
  const italicParts = text.split(/(\*.*?\*)/g);
  const processedItalicParts: React.ReactNode[] = [];

  italicParts.forEach((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      // This is italic text
      const italicContent = part.slice(1, -1);
      processedItalicParts.push(
        <em key={`italic-${index}`} className="italic text-gray-200">
          {italicContent}
        </em>
      );
    } else {
      // Regular text
      processedItalicParts.push(part);
    }
  });

  return <>{processedItalicParts}</>;
};

const ChatAssistant: React.FC<ChatAssistantProps> = ({
  selectedState,
  cancerType,
  stage,
  insuranceType,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { type: "user" as const, content: userMessage },
    ]);
    setIsTyping(true);

    const aiResponse = await sendMessageToAI(userMessage, {
      selectedState,
      cancerType,
      stage,
      insuranceType,
    });
    setIsTyping(false);
    setChatMessages((prev) => [
      ...prev,
      { type: "ai" as const, content: aiResponse },
    ]);
  };

  return (
    <div className="bg-gray-800 shadow-2xl border border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 p-6 border-b border-gray-700">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Bot className="mr-3 text-cyan-400" />
          AI Assistant
        </h3>
        <p className="text-gray-300 mt-2">
          Ask questions about treatment costs and resources
        </p>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-6 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium mb-2">Ready to Help!</p>
            <p className="text-sm">
              Start a conversation to get personalized guidance about cancer
              treatment costs and resources.
            </p>
          </div>
        ) : (
          chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-4 shadow-lg ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white"
                    : "bg-gray-700 border border-gray-600 text-gray-100"
                }`}
              >
                {message.type === "ai"
                  ? parseMarkdown(message.content)
                  : message.content}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 border border-gray-600 p-4 text-gray-300 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
                  <div className="w-2 h-2 bg-emerald-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 animate-pulse delay-150"></div>
                </div>
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-gray-700">
        <form onSubmit={handleChatSubmit} className="flex space-x-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about costs, resources, or support..."
            className="flex-1 p-4 bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isTyping}
            className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-4 hover:from-cyan-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-[1.05] disabled:hover:scale-100"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
