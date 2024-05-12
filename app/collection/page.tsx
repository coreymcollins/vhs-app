import { createClient } from '@/utils/supabase/server';
import { SearchResultGrid } from '../components/grid-search-result';
import { checkLoginStatus } from '../actions/check-login-status';

interface Tape {
    tape_id: number;
    barcode: string;
    title: string;
    description: string;
    genre_names: string[];
    year: number;
    cover_front_url: string;
}

async function getUsersTapes() {
    const supabase = createClient()
    const user = await checkLoginStatus()

    if ( null === user ) {
        return []
    }

    const { data, error } = await supabase.rpc('get_tapes_by_user_id', { useridquery: user.id });
    
    if (error) {
      console.error('Error fetching tapes in collection:', error.message);
      return null;
    }
    return data;
}

export default async function LibraryPage() {
    const tapes = await getUsersTapes()
    const userAuth = await checkLoginStatus()
    
    return (
        <>
            <h2>My Library</h2>
            { null !== tapes && <SearchResultGrid tapes={tapes} session={userAuth} /> }            
        </>
    )
}