'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SingleTapeGrid } from './single-tape-grid'
import { MultiTapeGridProps } from './multi-tape-grid'
import { getUserCollection, getUsersTapesByUuid } from '../actions'

export interface RealtimeTapesProps extends MultiTapeGridProps {
    from: number;
    to: number;
    username: string | '';
}

export default function RealtimeTapes( props: RealtimeTapesProps) {
    const {tapes, from, to, context, session, username} = props
    const signedInUserId = null !== session ? session.id : null
    const supabase = createClient()
    const router = useRouter()
    const [currentTapes, setCurrentTapes] = useState( tapes )

    const fetchLatestTapes = useCallback( async () => {

        if ( 'library' === context ) {
            const { data: updatedTapes } = await supabase
                .from('tapes')
                .select('*')
                .order('title', { ascending: true })

            setCurrentTapes( updatedTapes );

        } else if ( 'collection' === context ) {
            const updatedTapes = await getUsersTapesByUuid( signedInUserId )
            setCurrentTapes( updatedTapes );
        } else if ( 'collection-public' === context ) {
            const updatedTapes = await getUserCollection( username )
            setCurrentTapes( updatedTapes );
        }

        router.refresh();
    }, [supabase, router, context, signedInUserId, username]);

    useEffect(() => {
        const channel = supabase.channel( 'realtime tapes' )
            .on( 'postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tapes',
            }, () => {
                fetchLatestTapes()
            })
            .on( 'postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'users_tapes',
            }, () => {
                fetchLatestTapes()
            })
            .subscribe()

        return () => {
            supabase.removeChannel( channel )
        }
    }, [supabase, router, fetchLatestTapes])

    return (
        currentTapes.slice( from, to ).map(( tape: object, index: number ) => {
            const updatedProps = {
                ...props,
                tape,
                index
            };
            return (
                <SingleTapeGrid key={`tape-key-${index}`} {...updatedProps} />
            )
        })
    )
}