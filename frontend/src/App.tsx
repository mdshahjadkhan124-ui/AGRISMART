import { useEffect } from 'react'
import AppRouter from '@/routes/AppRouter'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { bootstrapSession } from '@/features/auth/authSlice'
import ChatbotWidget from '@/components/common/ChatbotWidget'

function App() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')

  useEffect(() => {
    dispatch(bootstrapSession())
  }, [dispatch])

  return (
    <>
      <AppRouter />
      {isAuthenticated && <ChatbotWidget />}
    </>
  )
}

export default App
