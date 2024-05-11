'use client'

import { useState, useEffect } from 'react';
import { addToLibrary, getUserTapeIds, removeFromLibrary } from '../actions';

interface AddRemoveTapeProps {
    tapeId: number;
    userTapeIds: number[];
}

const AddRemoveTape: React.FC<AddRemoveTapeProps> = ({ tapeId, userTapeIds }: { tapeId: any, userTapeIds: any}) => {
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