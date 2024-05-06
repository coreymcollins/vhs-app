import { EditForm } from '@/app/components/edit-tape';
import { createClient } from '@/utils/supabase/server';

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre_names: string[];
    year: number;
    date_added: string;
    date_updated: string;
    coverfront: Buffer | null;
}

export default async function EditTapePage( { params }: { params: { tape_id: number } } ) {
    const {tape_id} = params
    const supabase = createClient()

    const { data: tape, error } = await supabase.rpc( 'get_tape_by_tape_id', { tapeidquery: tape_id });

    if (error) {
        console.error(`Error searching for tape by tape ID: ${tape_id}`)
        throw error
    }
    
    return (
        <>
            <h2>Edit existing tape</h2>
            <EditForm tape={tape[0]}/>
        </>
    )
}