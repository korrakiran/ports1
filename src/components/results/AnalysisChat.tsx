'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage } from '@shared/types';
import { analysisApi } from '@/lib/api';
import { Button, Spinner } from '@/components/ui/primitives';

const SUGGESTIONS = [
  'Which country should I start with?',
  'Which are premium markets?',
  'What should I prepare first?'
];

/**
 * Assistant for a completed analysis.
 *
 * Answers come from the server, which reasons only over this analysis's matched
 * records — it is not a language model and will say when it cannot answer.
 */
export default function AnalysisChat({ analysisId }: { analysisId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Ask me about these results — why a country is on the list, which are premium, or what to prepare before contacting a buyer. I answer only from the markets this analysis matched.'
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || sending) return;

    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setSending(true);

    try {
      const reply = await analysisApi.chat(analysisId, question);
      setMessages((m) => [...m, reply]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            err instanceof Error
              ? `I could not reach the server: ${err.message}`
              : 'I could not reach the server.'
        }
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card stack stack-md">
      <div>
        <h2 className="section-title">Ask about these results</h2>
        <p className="muted" style={{ marginTop: 3 }}>
          Answers come only from the markets matched above.
        </p>
      </div>

      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble bubble--${m.role} fade-up`}>
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="bubble bubble--assistant">
            <Spinner size={14} />
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="row row-wrap" style={{ gap: 7 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              style={{ cursor: 'pointer' }}
              onClick={() => send(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="row row-sm"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about these markets…"
          aria-label="Ask a question"
        />
        <Button type="submit" disabled={!input.trim() || sending} aria-label="Send">
          <Send size={15} />
        </Button>
      </form>
    </div>
  );
}
