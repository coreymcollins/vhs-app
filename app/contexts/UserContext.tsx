'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type UserContextType = User | null

const UserContext = createContext<UserContextType>(null)
const UserUpdateContext = createContext<React.Dispatch<React.SetStateAction<UserContextType>> | undefined>(undefined)
const supabase = createClient()

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType>(null)
    const [queryClient] = useState( () => new QueryClient() )
    
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession()
            setUser(data.session ? data.session.user : null)
        }
        
        checkSession()
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session ? session.user : null)
        })
        
        return () => {
            subscription.unsubscribe()
        }
    }, [])
    
    return (
        <QueryClientProvider client={queryClient}>
            <UserContext.Provider value={user}>
                <UserUpdateContext.Provider value={setUser}>
                    {children}
                </UserUpdateContext.Provider>
            </UserContext.Provider>
        </QueryClientProvider>
    )
}

export const useUser = () => useContext(UserContext)

export const useSetUser = () => {
    const context = useContext(UserUpdateContext)
    if (context === undefined) {
        throw new Error('useSetUser must be used within a UserProvider')
    }
    return context
}
