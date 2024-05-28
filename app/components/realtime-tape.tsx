'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EditForm } from './edit-tape';

export default function RealtimeTape(tape: any) {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const channel = supabase.channel( 'realtime tape' )
            .on( 'postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tapes',
        }, () => {
            console.log( 'change received' )
            router.refresh()
        }).subscribe()

        return () => {
            supabase.removeChannel( channel )
        }
    }, [supabase, router])

    return (
        <EditForm tape={tape}/>
    )
}