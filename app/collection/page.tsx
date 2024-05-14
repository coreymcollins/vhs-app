import { createClient } from '@/utils/supabase/server';
import { checkLoginStatus } from '../actions/check-login-status';
import { WithPagination } from '../components/with-pagination';

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

export default async function LibraryPage( req: any ) {
    const tapes = await getUsersTapes()
    const userAuth = await checkLoginStatus()
    let { page } = req.searchParams
    page = undefined === page ? 1 : page

    return (
        <>
            <h2>My Library</h2>
            { null !== tapes && <WithPagination tapes={tapes} session={userAuth} pageNumber={page} /> }
        </>
    )
}