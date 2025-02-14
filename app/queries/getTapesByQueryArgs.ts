import { getTapesByGenre } from '@/app/queries/getTapesByGenre';
import { getTapesByDistributor } from '@/app/queries/getTapesByDistributor';

export async function getTapesByQueryArgs( results: any, searchParams: any ) {

    if ( undefined === searchParams ) {
        return results
    }

    if ( undefined !== searchParams.distributor && undefined === searchParams.genre ) {
        let distributorTapes = await getTapesByDistributor( searchParams.distributor )

        if ( Array.isArray( distributorTapes ) && Array.isArray( results ) ) {
            let foundTapes = new Set( distributorTapes.map( item => item.tape_id ) )
            results = results.filter( item => foundTapes.has( item.tape_id ) )
        }
    } else if ( undefined !== searchParams.genre && undefined === searchParams.distributor ) {
        let genreTapes = await getTapesByGenre( searchParams.genre )

        if ( Array.isArray( genreTapes ) && Array.isArray( results ) ) {
            let foundTapes = new Set( genreTapes.map( item => item.tape_id ) )
            results = results.filter( item => foundTapes.has( item.tape_id ) )
        }
    } else if ( undefined !== searchParams.genre && undefined !== searchParams.distributor ) {
        let distributorTapes = await getTapesByDistributor( searchParams.distributor )
        let genreTapes = await getTapesByGenre( searchParams.genre )

        if ( Array.isArray( distributorTapes ) && Array.isArray( genreTapes ) && Array.isArray( results ) ) {
            let foundDistributorTapes = new Set( distributorTapes.map( item => item.tape_id ) )
            let foundGenreTapes = new Set( genreTapes.map( item => item.tape_id ) )
            
            results = genreTapes.filter( item => foundDistributorTapes.has( item.tape_id ) && foundGenreTapes.has( item.tape_id ) )
        }
    }

    return results
}