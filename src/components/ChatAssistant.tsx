import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProjectDomain, ProjectPlan } from '../types';
import { sanitizeInput } from '../utils/sanitizer';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
  Minimize2,
  Maximize2,
  Mic,
  MicOff,
} from 'lucide-react';

/**
 * Props for the ChatAssistant component.
 */
interface ChatAssistantProps {
  currentProject: string;
  currentDomain: ProjectDomain;
  currentPlan?: ProjectPlan;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

/**
 * Default starter messages welcoming the student.
 */
const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg-1',
    role: 'assistant',
    content:
      "Hello! I'm your dedicated Project Mentor. I'm here to answer questions about your project architecture, suggest implementation steps, or explain any part of your roadmap and genome strand. What would you like to explore?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

/**
 * Quick action prompt chips for students.
 */
const QUICK_PROMPTS = [
  'Why were these features suggested?',
  'How do I implement Sprint 1?',
  'What technologies should I learn next?',
  'Explain the genome strand',
];

/**
 * ChatAssistant provides a continuous, accessible, and responsive AI Mentor chatbox.
 * Supports keyboard navigation (Enter to send, Shift+Enter for newline),
 * aria-live="polite" typing indicators, input sanitization, and graceful fallback.
 *
 * @param {ChatAssistantProps} props - Component properties.
 * @returns {JSX.Element} The rendered chat assistant interface.
 */
export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  currentProject,
  currentDomain,
  currentPlan,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice input not supported in this browser.');
      setTimeout(() => setSpeechError(null), 3500);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechError('Microphone permission denied or inactive.');
        setTimeout(() => setSpeechError(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechError('Could not start voice recognition.');
      setTimeout(() => setSpeechError(null), 3500);
    }
  };

  const toggleChat = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (
      isExpanded &&
      !isMinimized &&
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === 'function'
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded, isMinimized, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isExpanded && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isExpanded, isMinimized]);

  /**
   * Generates a contextual fallback response if the API endpoint is unavailable.
   */
  const getContextualFallbackResponse = (userPrompt: string): string => {
    const pLower = userPrompt.toLowerCase();

    if (pLower.includes('why') && pLower.includes('feature')) {
      return (
        `For **${currentProject}** in the **${currentDomain}** domain, these features were selected to deliver an MVP that solves the primary friction point immediately while laying ground for scalability. ` +
        `They balance client-side responsiveness, high security, and minimal architectural complexity.`
      );
    }

    if (pLower.includes('sprint 1') || pLower.includes('implement')) {
      return (
        `To kick off Sprint 1 for **${currentProject}**:\n` +
        `1. **Repository Setup**: Initialize clean directory structure with zero unwanted dependencies.\n` +
        `2. **State & Contracts**: Define domain types and reactive hooks first.\n` +
        `3. **Core Input & Validation**: Implement sanitized form inputs with instant feedback.\n` +
        `4. **Smoke Testing**: Verify accessibility and mobile rendering before adding tertiary features.`
      );
    }

    if (pLower.includes('learn') || pLower.includes('technolog')) {
      return (
        `For **${currentDomain}**, I recommend sharpening your knowledge in:\n` +
        `- **Modern TypeScript**: Strict types, discriminated unions for state management.\n` +
        `- **Web Accessibility (WCAG AAA)**: ARIA landmarks, keyboard focus rings, and high contrast.\n` +
        `- **Zero-Bloat APIs**: Native Fetch, Web Workers, and lightweight client state.\n` +
        `- **Security Guardrails**: Strict CSP headers, HTML/URL sanitization against XSS.`
      );
    }

    if (pLower.includes('genome') || pLower.includes('strand')) {
      return (
        `The **Project Genome Strand** represents the biological DNA of your software:\n` +
        `- **Architecture Base Pairs**: Foundation layers (State, API, Storage).\n` +
        `- **Guardrails & Security**: Built-in shields protecting from vulnerabilities.\n` +
        `- **Checkpoints**: Milestones ensuring your project is podium-ready.\n` +
        `Each mutation optimizes your codon efficiency towards 100% fitness!`
      );
    }

    return (
      `Regarding **${currentProject}**: That's a great question! For a production-ready **${currentDomain}** solution, ` +
      `ensure your data flow is strictly unidirectional, all inputs are scrubbed with defensive sanitization, and your bundle remains under 10 MB for rapid load times.`
    );
  };

  /**
   * Submits a user message and fetches AI guidance.
   */
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputValue;
    const cleanText = sanitizeInput(rawText);

    if (!cleanText.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Attempt Next.js API Route (/api/chat)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyContent = data.reply || data.message;
        if (replyContent) {
          setMessages((prev) => [
            ...prev,
            {
              id: `asst-${Date.now()}`,
              role: 'assistant',
              content: replyContent,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // If /api/chat is not available (e.g. running in purely static Vite dev without proxy),
      // we proceed to local contextual AI synthesis.
    }

    // 2. Direct Gemini 3.6 Flash fallback using live client key if available
    const clientApiKey =
      (typeof process !== 'undefined' && process.env?.GOOGLE_API_KEY) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_API_KEY) ||
      '';

    if (clientApiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${clientApiKey}`;
        const promptContext =
          `You are an expert academic project mentor helping a student with their hackathon project "${currentProject}" in the "${currentDomain}" domain.\n` +
          (currentPlan ? `Current Plan Summary: ${currentPlan.summary}\n` : '') +
          `Student Question: "${cleanText}"\n` +
          `Provide an encouraging, concise, actionable answer (max 3-4 paragraphs or bullets) with no fluff.`;

        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: promptContext }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
          }),
        });

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const candidateText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            setMessages((prev) => [
              ...prev,
              {
                id: `asst-${Date.now()}`,
                role: 'assistant',
                content: candidateText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setIsTyping(false);
            return;
          }
        }
      } catch {
        // Fallback to domain synthesis if upstream fails
      }
    }

    // 3. Robust contextual fallback response
    setTimeout(() => {
      const fallbackReply = getContextualFallbackResponse(cleanText);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  /**
   * Handles keyboard shortcuts for the text input:
   * Enter = Send, Shift+Enter = Multiline
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Launcher Pill when closed */}
      {!isExpanded && (
        <button
          onClick={toggleChat}
          className="btn btn-primary"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 999,
            borderRadius: 'var(--radius-full)',
            padding: '12px 22px',
            boxShadow: '0 8px 32px rgba(0, 245, 212, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.92rem',
            fontWeight: 700,
          }}
          aria-label="Open Project Mentor AI Chat Assistant"
        >
          <MessageSquare size={18} aria-hidden="true" />
          <span>Ask Project Mentor</span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00f5d4',
              boxShadow: '0 0 10px #00f5d4',
            }}
          />
        </button>
      )}

      {/* Persistent Dockable Chat Panel */}
      {isExpanded && (
        <div
          role="complementary"
          aria-label="AI Project Mentor Chatbox"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 'min(420px, calc(100vw - 32px))',
            height: isMinimized ? '56px' : 'min(620px, calc(100vh - 100px))',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--glass-shadow)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.2s ease, background 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #00f5d4 0%, #7928ca 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="#070a13" aria-hidden="true" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Project Mentor AI
                  </h3>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'inline-block',
                    }}
                    title="Mentor Online"
                  />
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                  Active Domain: <strong style={{ color: '#00f5d4' }}>{currentDomain}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={isMinimized ? 'Expand chatbox' : 'Minimize chatbox'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={toggleChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Close chatbox"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context bar */}
              <div
                style={{
                  padding: '6px 14px',
                  background: 'rgba(0, 245, 212, 0.05)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={12} color="#00f5d4" />
                <span>Advising: <strong>{currentProject}</strong></span>
              </div>

              {/* Message scroll container */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
                tabIndex={0}
                aria-label="Chat messages history"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 3,
                        fontSize: '0.7rem',
                        color: 'var(--text-dim)',
                      }}
                    >
                      {msg.role === 'assistant' ? (
                        <>
                          <Bot size={12} color="#00f5d4" />
                          <span>Mentor</span>
                        </>
                      ) : (
                        <>
                          <span>You</span>
                          <User size={12} color="#c084fc" />
                        </>
                      )}
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      style={{
                        maxWidth: '86%',
                        padding: '10px 14px',
                        borderRadius:
                          msg.role === 'user'
                            ? '14px 14px 2px 14px'
                            : '14px 14px 14px 2px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(121, 40, 202, 0.4) 100%)'
                            : 'rgba(255, 255, 255, 0.04)',
                        border:
                          msg.role === 'user'
                            ? '1px solid rgba(168, 85, 247, 0.4)'
                            : '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <div
                    aria-live="polite"
                    aria-atomic="true"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      width: 'fit-content',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <RefreshCw className="spin" size={13} color="#00f5d4" />
                    <span>Mentor is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div
                style={{
                  padding: '8px 14px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'rgba(7, 10, 19, 0.5)',
                  display: 'flex',
                  gap: 6,
                  overflowX: 'auto',
                }}
              >
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: '12px 14px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 10px',
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask mentor anything about your project..."
                    rows={1}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.86rem',
                      outline: 'none',
                      resize: 'none',
                      maxHeight: 90,
                      fontFamily: 'inherit',
                    }}
                    aria-label="Type your message to the Project Mentor"
                  />

                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    style={{
                      background: isListening
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(255, 255, 255, 0.08)',
                      border: isListening ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                    aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
                    title={isListening ? 'Listening... click to stop' : 'Click to speak to mentor'}
                  >
                    {isListening ? (
                      <MicOff size={15} color="#ef4444" />
                    ) : (
                      <Mic size={15} color="#38bdf8" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    style={{
                      background: inputValue.trim() ? '#00f5d4' : 'rgba(255, 255, 255, 0.1)',
                      color: '#070a13',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                    aria-label="Send message to mentor"
                  >
                    <Send size={15} color={inputValue.trim() ? '#070a13' : 'rgba(255, 255, 255, 0.4)'} />
                  </button>
                </div>

                {/* Voice listening pulse / error indicator */}
                {isListening && (
                  <div
                    aria-live="polite"
                    style={{
                      marginTop: 6,
                      fontSize: '0.72rem',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 8px #ef4444',
                        display: 'inline-block',
                      }}
                    />
                    <span>Listening... speak your question</span>
                  </div>
                )}

                {speechError && (
                  <div
                    aria-live="polite"
                    style={{
                      marginTop: 6,
                      fontSize: '0.72rem',
                      color: '#f59e0b',
                    }}
                  >
                    {speechError}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 6,
                    fontSize: '0.68rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span>Enter to send, Shift+Enter for newline</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <HelpCircle size={10} /> Sanitized &amp; secure
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
