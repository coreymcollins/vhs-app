'use client'

import { useState, useEffect } from 'react';
import { addToLibrary, removeFromLibrary } from '../actions';

interface AddRemoveTapeProps {
    tapeId: number;
    userTapeIds: number[];
    user: any;
}

const AddRemoveTape: React.FC<AddRemoveTapeProps> = (props: AddRemoveTapeProps) => {
    let {tapeId, userTapeIds, user} = props
    const [loading, setloading] = useState( true )
    const [inCollection, setInCollection] = useState(false)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setInCollection( userTapeIds.includes( tapeId ) )
                setloading( false )
            } catch ( error ) {
                console.error( 'Error checking library for tape:', error )
                setloading( false )
            }
        }
        
        fetchData()
    }, [tapeId, userTapeIds])

    const handleButtonClick = async () => {
        try {
            if ( inCollection ) {
                await removeFromLibrary( tapeId, user.id )
            } else {
                await addToLibrary( tapeId, user.id )
            }
            
            setInCollection( prevState => !prevState )
        } catch ( error ) {
            console.error( 'Error performing action:', error )
        }
    }

    if ( loading ) {
        return
    }

    return (
        <button onClick={handleButtonClick} className="button button-library">
            {inCollection ? `Remove from Collection` : `Add to Collection`}
        </button>
    );
};
    
export default AddRemoveTape;