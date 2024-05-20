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
    const [inLibrary, setInLibrary] = useState(false)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setInLibrary( userTapeIds.includes( tapeId ) )
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
            if ( inLibrary ) {
                await removeFromLibrary( tapeId, user.id )
            } else {
                await addToLibrary( tapeId, user.id )
            }
            
            setInLibrary( prevState => !prevState )
        } catch ( error ) {
            console.error( 'Error performing action:', error )
        }
    }

    if ( loading ) {
        return
    }

    return (
        <button onClick={handleButtonClick} className="button-library">
            {inLibrary ? `Remove from Library` : `Add to Library`}
        </button>
    );
};
    
export default AddRemoveTape;