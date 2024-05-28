import { EditForm } from '@/app/components/edit-tape';
import { supabase } from '@/app/lib/supabase'

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre_names: string[];
    year: number;
    date_added: string;
    date_updated: string;
    cover_front_url: string;
}

export async function generateMetadata( { params }: { params: { tape_id: number } } ) {
    const tapeId = params.tape_id

    const { data: tape, error: tapeError } = await supabase
        .from( 'tapes' )
        .select( 'title' )
        .eq( 'tape_id', tapeId )
        .single()

    if ( tapeError ) {
        console.error( 'Error fetching tape:', tapeError )
        
        return {
            title: 'Revival Video',
            description: 'Be kind. Revive.',
        }
    }

    return {
        title: `Revival Video: Edit "${tape.title}"`,
        description: 'Be kind. Revive.',
    }
}

export default async function EditTapePage( { params }: { params: { tape_id: number } } ) {
    const {tape_id} = params

    const { data: tape, error } = await supabase.rpc( 'get_tape_by_tape_id', { tapeidquery: tape_id });


        await supabase
            .storage
            .updateBucket('covers', {
                public: false,
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
                fileSizeLimit: 1024
        })


    if (error) {
        console.error(`Error searching for tape by tape ID: ${tape_id}`)
        throw error
    }
    
    return (
        <>
            <div className="page-content-header">
                <h2>Edit existing tape</h2>
            </div>
            <EditForm tape={tape[0]}/>
        </>
    )
}