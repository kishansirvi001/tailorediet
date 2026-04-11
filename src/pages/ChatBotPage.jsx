import { useState, useRef } from 'react'
import SiteShell from '../components/SiteShell.jsx'
import { sendChatMessage } from '../services/chatApi.js'

function ChatMessage({ msg }) {
  return (
    <div className={`mb-3 rounded-lg p-3 ${msg.role === 'user' ? 'bg-white/80 text-stone-900 self-end' : 'bg-stone-900 text-white self-start'}`}>
      <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
    </div>
  )
}

export default function ChatBotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi — I\'m TailorDiet assistant. Tell me about your goals and lifestyle; I can help with diet and fitness planning.' },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const endRef = useRef(null)

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMsg = { role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setIsSending(true)

    try {
      const reply = await sendChatMessage(text)
      const assistantMsg = { role: 'assistant', text: reply }
      setMessages((m) => [...m, assistantMsg])
    } catch (err) {
      const assistantMsg = { role: 'assistant', text: `Error: ${err.message}` }
      setMessages((m) => [...m, assistantMsg])
    } finally {
      setIsSending(false)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-lg border p-6 bg-white/95">
          <h1 className="text-xl font-semibold">TailorDiet Chat</h1>
          <p className="text-sm text-stone-600 mt-2">Ask about lifestyle improvement, diet planning, meal ideas, and fitness guidance.</p>

          <div className="mt-6 flex h-[60vh] flex-col overflow-hidden rounded-md border bg-stone-50 p-4">
            <div className="mb-3 flex flex-1 flex-col overflow-auto pr-2" id="chat-window">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <ChatMessage msg={m} />
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="mt-3 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." className="flex-1 rounded-md border px-3 py-2" />
              <button type="submit" disabled={isSending} className="rounded-md bg-amber-500 px-4 py-2 text-white">{isSending ? 'Sending...' : 'Send'}</button>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
