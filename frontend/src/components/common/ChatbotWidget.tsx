import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { MessageCircle, X } from 'lucide-react'
import { queryChatbot } from '@/features/chatbot/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChatEntry {
  from: 'user' | 'bot'
  text: string
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<ChatEntry[]>([])

  const ask = useMutation({
    mutationFn: (message: string) => queryChatbot(message, lang),
    onSuccess: (result) => {
      setHistory((h) => [...h, { from: 'bot', text: result.answer }])
    },
    onError: () => {
      setHistory((h) => [...h, { from: 'bot', text: "Sorry, something went wrong. Please try again." }])
    },
  })

  const onSend = () => {
    const message = input.trim()
    if (!message) return
    setHistory((h) => [...h, { from: 'user', text: message }])
    setInput('')
    ask.mutate(message)
  }

  if (!open) {
    return (
      <Button size="icon" className="fixed bottom-4 right-4 z-50 size-12 rounded-full shadow-lg" onClick={() => setOpen(true)}>
        <MessageCircle className="size-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 flex h-96 w-80 flex-col shadow-lg">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">AgriSmart Help</CardTitle>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`text-xs ${lang === 'en' ? 'font-semibold' : 'text-muted-foreground'}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`text-xs ${lang === 'hi' ? 'font-semibold' : 'text-muted-foreground'}`}
            onClick={() => setLang('hi')}
          >
            हिं
          </button>
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {history.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {lang === 'en'
                ? 'Ask me about crop suggestions, fertilizer, disease reports, weather, experts, marketplace, or schemes.'
                : 'फसल सुझाव, उर्वरक, रोग रिपोर्ट, मौसम, विशेषज्ञ, मार्केटप्लेस या योजनाओं के बारे में पूछें।'}
            </p>
          )}
          {history.map((entry, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                entry.from === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted self-start'
              }`}
            >
              {entry.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder={lang === 'en' ? 'Type your question…' : 'अपना सवाल लिखें…'}
          />
          <Button onClick={onSend} disabled={ask.isPending}>
            {lang === 'en' ? 'Ask' : 'पूछें'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
