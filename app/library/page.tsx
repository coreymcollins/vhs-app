import { SearchResultTable } from '../components/table-search-result'
import { createClient } from '@/utils/supabase/server';
import { getCurrentUserSupabaseAuth } from '../actions';


async function getTapesWithGenres() {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_tapes_with_genres');
    if (error) {
      console.error('Error fetching tapes in library:', error.message);
      return null;
    }
    return data;
}

export default async function LibraryPage() {
    const data = await getTapesWithGenres()
    const userAuth = await getCurrentUserSupabaseAuth()
    
    return (
        <>
            <h2>Full Library</h2>
            <SearchResultTable tapes={data} session={userAuth} />
        </>
    )
}

