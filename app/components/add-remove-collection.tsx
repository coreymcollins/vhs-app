'use client'

import { useState, useEffect } from 'react';
import { addToCollection, checkCollectionForTape, removeFromCollection } from '../actions';

interface AddRemoveTapeProps {
    tapeId: string;
}

const AddRemoveTape: React.FC<AddRemoveTapeProps> = ({ tapeId }) => {
    const [inCollection, setInCollection] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await checkCollectionForTape( tapeId )
                setInCollection( result )
            } catch ( error ) {
                console.error( 'Error checking collection for tape:', error )
            }
        }

        fetchData()
    }, [tapeId])

    const handleButtonClick = async () => {
        try {
            if ( inCollection ) {
                await removeFromCollection( tapeId )
            } else {
                await addToCollection( tapeId )
            }

            setInCollection( prevState => !prevState )
        } catch ( error ) {
            console.error( 'Error performing action:', error )
        }
    }
    
    return (
        <button onClick={handleButtonClick} className="button-collection">
            {inCollection ? `Remove from Collection` : `Add to Collection`}
        </button>
    );
};
    
export default AddRemoveTape;