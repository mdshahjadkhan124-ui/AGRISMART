import { useEffect } from 'react'
import AppRouter from '@/routes/AppRouter'
import { useAppDispatch } from '@/app/hooks'
import { bootstrapSession } from '@/features/auth/authSlice'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(bootstrapSession())
  }, [dispatch])

  return <AppRouter />
}

export default App
