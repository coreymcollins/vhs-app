'use client'

import { useState, useEffect } from 'react';
import { addToLibrary, getUserTapeIds, removeFromLibrary } from '../actions';

interface AddRemoveTapeProps {
    tapeId: number;
}

const AddRemoveTape: React.FC<AddRemoveTapeProps> = ({ tapeId }) => {
    const [inLibrary, setInLibrary] = useState(false)
    const [userTapeIds, setUserTapeIds] = useState<number[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tapeIds = await getUserTapeIds()
                
                setUserTapeIds( tapeIds )
                setInLibrary( tapeIds.includes( tapeId ) )
            } catch ( error ) {
                console.error( 'Error checking library for tape:', error )
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
    
    return (
        <button onClick={handleButtonClick} className="button-library">
            {inLibrary ? `Remove from Library` : `Add to Library`}
        </button>
    );
};
    
export default AddRemoveTape;