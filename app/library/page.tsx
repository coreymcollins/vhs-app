import { createClient } from '@/utils/supabase/server';
import { SearchResultGrid } from '../components/grid-search-result';
import { checkLoginStatus } from '../actions/check-login-status';


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
    const userAuth = await checkLoginStatus()
    
    return (
        <>
            <h2>Full Library</h2>
            <SearchResultGrid tapes={data} session={userAuth} />
        </>
    )
}

