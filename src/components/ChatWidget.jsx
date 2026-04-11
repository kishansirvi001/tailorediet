import { useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../services/chatApi.js'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi — I\u2019m TailorDiet assistant. Ask about meals, diet, or fitness." },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [messages, open])

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return
    const userMsg = { role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)
    try {
      const reply = await sendChatMessage(text)
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: `Error: ${err.message}` }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Container */}
      <div className={`flex flex-col transition-all ${open ? 'w-80 h-[520px]' : ''}`}>
        {/* Chat box */}
        {open && (
          <div className="flex h-[520px] w-80 flex-col overflow-hidden rounded-2xl border bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-white font-bold">TD</div>
                <div>
                  <div className="text-sm font-semibold">TailorDiet assistant</div>
                  <div className="text-xs text-stone-400">Helpful tips about meals & fitness</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md px-2 py-1 text-stone-500 hover:bg-stone-100">Close</button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-auto p-3" id="chat-widget-window">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-full ${m.role === 'user' ? 'self-end' : 'self-start'}`}>
                  <div className={`rounded-lg p-2 ${m.role === 'user' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-800'}`}>
                    <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="px-3 py-2">
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button type="submit" disabled={sending} className="rounded-lg bg-amber-500 px-3 py-2 text-sm text-white">{sending ? '...' : 'Send'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Floating toggle button */}
        <button
          onClick={() => setOpen((s) => !s)}
          aria-label="Open chat"
          className="mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
            <path d="M3 8a9 9 0 0118 0v3a9 9 0 01-9 9H9l-4 2V14a6 6 0 01-2-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
