'use client'

import { useUser } from '@/app/contexts/UserContext'
import PageHeader from './header'

const ClientComponentWrapper = ({ children }: { children: React.ReactNode }) => {
    const user = useUser()

    return (
        <>
            <PageHeader user={user} />
            <main>{children}</main>
        </>
    )
}

export default ClientComponentWrapper
