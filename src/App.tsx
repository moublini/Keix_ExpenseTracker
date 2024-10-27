import { ExpenseTracker } from './components/ExpenseTracker'
import './App.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';

function App() {
  const [ queryClient ] = useState(() => new QueryClient());
  const [ trpcClient ] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:8080',
        headers: {
          authorization: 'Basic moublini:admin',
        }
      }),
    ]
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <main className="h-full flex align-middle justify-center">
          <ExpenseTracker></ExpenseTracker>
        </main>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
