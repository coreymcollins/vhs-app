'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SingleTapeGrid } from './single-tape-grid';

export default function RealtimeTapes({tapes, from, to, props}: {tapes: any, from: number, to: number, props: any}) {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const channel = supabase.channel( 'realtime tapes' )
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

    const tapesArray = Array.isArray(tapes) ? tapes : [tapes]

    return (
        tapesArray.slice( from, to ).map(( tape, index ) => {
            const updatedProps = {
                ...props,
                tape,
                index
            };
            return (
                <SingleTapeGrid key={`listing-${tape.tape_id}`} {...updatedProps} />
            )
        })
    )
}