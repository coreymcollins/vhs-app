'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

type UserContextType = User | null

const UserContext = createContext<UserContextType>(null)
const UserUpdateContext = createContext<React.Dispatch<React.SetStateAction<UserContextType>> | undefined>(undefined)
const supabase = createClient()

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType>(null)
    
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
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={setUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
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
