import { SearchResultTable } from '../components/table-search-result'
import { createClient } from '@/utils/supabase/server';
import { getCurrentUserSupabaseAuth, getCurrentUserSupabaseId } from '../actions';

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre_names: string[];
    year: number;
    coverfront: Buffer | null;
}

async function getUsersTapes() {
    const supabase = createClient()
    const userId = await getCurrentUserSupabaseId()

    const { data, error } = await supabase.rpc('get_tapes_by_user_id', { useridquery: userId });
    
    if (error) {
      console.error('Error fetching tapes in collection:', error.message);
      return null;
    }
    return data;
}

export default async function LibraryPage() {
    const tapes = await getUsersTapes()
    const userAuth = await getCurrentUserSupabaseAuth()
    
    return (
        <>
            <h2>My Library</h2>
            { null !== tapes && <SearchResultTable tapes={tapes} session={userAuth} /> }            
        </>
    )
}