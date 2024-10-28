import { ExpenseTracker } from './components/ExpenseTracker'
import './App.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import { Auth } from './components/Auth';

function App() {
  const [ queryClient ] = useState(() => new QueryClient());
  const [ trpcClient ] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:8080',
        headers: ()  => {
          const authorization = localStorage.getItem('keix_auth_credentials') ?? '';

          return { authorization: `Basic ${authorization}` };
        },
      }),
    ]
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <main className="h-full flex gap-8 items-center justify-center">
          <Auth></Auth>
          <ExpenseTracker></ExpenseTracker>
        </main>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
