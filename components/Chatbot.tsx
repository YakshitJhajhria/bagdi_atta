'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Wheat, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  isHtml?: boolean;
}

const PRESET_ANSWERS_FALLBACK = {
  moq: `Our wholesale B2B distributor orders require a **Minimum Order Quantity (MOQ) of 100 kg** total weight. You can mix and match different sizes (5kg, 10kg, 25kg) and products (Atta, Oils, Pulses) to meet this minimum.`,
  distributor: `To become a distributor, please visit our **[Distributor Portal](/distributor/apply)** and submit the application form. Our admin team will review and approve your application within 24-48 hours. Once approved, you can login to access wholesale pricing.`,
  shipping: `We offer **free home delivery** on all retail (D2C) orders. Orders are typically processed and shipped within 24-48 hours. B2B wholesale shipping and transit freight terms are coordinated upon order confirmation.`,
  returns: `We stand by our quality and offer a **7-day return policy**. If you receive a damaged packet or are unsatisfied with the quality, please contact us on WhatsApp with your Order ID, and we will initiate a free replacement or refund.`,
  products: `We offer premium organic staple products:\n- **Bagdi Atta** (5kg, 10kg, 25kg) — traditional stone-ground wheat flour\n- **Mustard Oil** (1L, 5L) — wood-pressed cold-extracted oil\n- **Moong Dal** (1kg, 2kg) — organic unpolished split yellow pulse\n\nYou can browse all items on our **[Products Catalog](/products)** page.`,
  whatsapp: `Need immediate human support? You can reach us directly on WhatsApp at **[+91 98765 43210](https://wa.me/919876543210)**. We are active from 9 AM to 8 PM daily.`
};

const QUICK_OPTIONS = [
  { label: '📦 B2B MOQ Limit?', key: 'moq' },
  { label: '🤝 Become a Distributor', key: 'distributor' },
  { label: '🚚 Shipping & Delivery', key: 'shipping' },
  { label: '♻️ Return & Refund', key: 'returns' },
  { label: '🌾 Browse Products', key: 'products' },
  { label: '💬 WhatsApp Chat', key: 'whatsapp' },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [dbSettings, setDbSettings] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! Welcome to Bagdi Atta support. How can I help you today? Feel free to select one of the quick options below or ask your question directly!',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load dynamic settings from DB
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/chatbot/settings');
        const data = await response.json();
        if (response.ok && data.success && data.settings) {
          setDbSettings(data.settings);
          setMessages([
            {
              id: 'welcome',
              sender: 'bot',
              text: data.settings.welcomeMessage,
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to load chatbot settings:', error);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowBadge(false);
    }
  };

  const getAnswer = (key: string): string => {
    if (dbSettings && dbSettings[key]) {
      return dbSettings[key];
    }
    return PRESET_ANSWERS_FALLBACK[key as keyof typeof PRESET_ANSWERS_FALLBACK] || 'Sorry, I did not understand that.';
  };

  const addBotReply = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text,
        },
      ]);
    }, 850);
  };

  const handleOptionClick = (key: string, label: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: label,
      },
    ]);

    // Add bot reply
    addBotReply(getAnswer(key));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: userText,
      },
    ]);

    // Keyword matching
    const query = userText.toLowerCase();
    let responseText = '';

    if (query.includes('moq') || query.includes('minimum') || query.includes('kg') || query.includes('weight')) {
      responseText = getAnswer('moq');
    } else if (query.includes('distributor') || query.includes('partner') || query.includes('apply') || query.includes('wholesale')) {
      responseText = getAnswer('distributor');
    } else if (query.includes('shipping') || query.includes('delivery') || query.includes('courier') || query.includes('dispatch')) {
      responseText = getAnswer('shipping');
    } else if (query.includes('return') || query.includes('refund') || query.includes('replace') || query.includes('cancel')) {
      responseText = getAnswer('returns');
    } else if (query.includes('product') || query.includes('atta') || query.includes('oil') || query.includes('dal') || query.includes('flour')) {
      responseText = getAnswer('products');
    } else if (query.includes('whatsapp') || query.includes('number') || query.includes('phone') || query.includes('contact') || query.includes('support') || query.includes('agent')) {
      responseText = getAnswer('whatsapp');
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('hola')) {
      responseText = 'Hello there! How can I assist you with Bagdi Atta products or distributor registration today?';
    } else {
      responseText = `I couldn't find an exact answer for "${userText}".\n\nFor general inquiries, feel free to use the quick buttons below, or chat directly with our team on **[WhatsApp](https://wa.me/919876543210)**.`;
    }

    addBotReply(responseText);
  };

  // Helper to render markdown-like links/formatting
  const renderMessageText = (text: string) => {
    const parts = [];
    let currentIdx = 0;

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIdx = match.index;
      if (matchIdx > currentIdx) {
        parts.push(text.substring(currentIdx, matchIdx));
      }

      const label = match[1];
      const url = match[2];
      const isExternal = url.startsWith('http') || url.startsWith('https') || url.startsWith('tel') || url.startsWith('mailto');

      if (isExternal) {
        parts.push(
          <a
            key={matchIdx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-green-700 underline font-bold inline-flex items-center gap-0.5 hover:text-brand-green-900"
          >
            {label}
            <ExternalLink className="h-3 w-3 inline" />
          </a>
        );
      } else {
        parts.push(
          <Link
            key={matchIdx}
            href={url}
            className="text-brand-green-700 underline font-bold hover:text-brand-green-900"
          >
            {label}
          </Link>
        );
      }

      currentIdx = linkRegex.lastIndex;
    }

    if (currentIdx < text.length) {
      parts.push(text.substring(currentIdx));
    }

    const renderedElements = parts.map((part, index) => {
      if (typeof part === 'string') {
        const subParts = [];
        let subIdx = 0;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let boldMatch;

        while ((boldMatch = boldRegex.exec(part)) !== null) {
          const boldIdx = boldMatch.index;
          if (boldIdx > subIdx) {
            subParts.push(part.substring(subIdx, boldIdx));
          }
          subParts.push(<strong key={boldIdx} className="font-semibold text-stone-950">{boldMatch[1]}</strong>);
          subIdx = boldRegex.lastIndex;
        }
        if (subIdx < part.length) {
          subParts.push(part.substring(subIdx));
        }
        return <span key={index}>{subParts.length > 0 ? subParts : part}</span>;
      }
      return part;
    });

    return (
      <div className="whitespace-pre-wrap leading-relaxed">
        {renderedElements}
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleOpenToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-700 text-white shadow-xl hover:bg-brand-green-800 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        aria-label="Toggle support chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {showBadge && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-wheat-500 text-[10px] font-bold text-stone-900 border border-white animate-bounce">
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col rounded-2xl border border-stone-200/50 bg-white shadow-2xl overflow-hidden transition-all duration-300 max-sm:w-[calc(100vw-2rem)] max-sm:right-4 max-sm:bottom-22 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-green-800 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wheat-100 text-brand-green-800">
                <Wheat className="h-5.5 w-5.5 text-brand-green-700" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide">Bagdi Atta Support</h3>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-brand-green-100/90 font-medium">Assistant • Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-cream/30 p-4 space-y-4 flex flex-col scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[82%] ${
                  msg.sender === 'user' ? 'self-end' : 'self-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-green-700 text-white rounded-tr-none'
                      : 'bg-white text-stone-850 rounded-tl-none border border-stone-100'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 self-start bg-white border border-stone-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chip Suggestions */}
          <div className="bg-cream/40 border-t border-stone-100 px-3 py-2">
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto py-0.5">
              {QUICK_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleOptionClick(opt.key, opt.label)}
                  className="rounded-full bg-white border border-stone-200 px-2.5 py-1 text-xs text-stone-600 hover:bg-wheat-50 hover:border-wheat-300 hover:text-brand-green-800 transition-colors font-medium cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Panel */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-stone-200/50 bg-white p-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-brand-green-600 focus:bg-white focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-700 text-white hover:bg-brand-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
