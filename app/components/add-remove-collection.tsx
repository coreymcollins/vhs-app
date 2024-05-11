'use client'

import { useState, useEffect } from 'react';
import { addToLibrary, getUserTapeIds, removeFromLibrary } from '../actions';

interface AddRemoveTapeProps {
    tapeId: number;
}

const AddRemoveTape: React.FC<AddRemoveTapeProps> = ({ tapeId }) => {
    const [loading, setloading] = useState( true )
    const [inLibrary, setInLibrary] = useState(false)
    const [userTapeIds, setUserTapeIds] = useState<number[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tapeIds = await getUserTapeIds()
                setUserTapeIds( tapeIds )
                setInLibrary( tapeIds.includes( tapeId ) )
                setloading( false )
            } catch ( error ) {
                console.error( 'Error checking library for tape:', error )
                setloading( false )
            }
        }

        fetchData()
    }, [tapeId])

    const handleButtonClick = async () => {
        try {
            if ( inLibrary ) {
                await removeFromLibrary( tapeId )
            } else {
                await addToLibrary( tapeId )
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