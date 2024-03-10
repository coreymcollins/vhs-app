import { Buffer } from 'buffer';

export function SearchResultTable({searchResult}: {searchResult: any}) {

    const imageCoverFront = searchResult.coverfront ? Buffer.from( searchResult.coverfront ).toString( 'base64' ) : null
    
    return (
        <table>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Barcode</td>
                    <td>Title</td>
                    <td>Description</td>
                    <td>Genre</td>
                    <td>Release Year</td>
                    <td>Front Cover</td>
                </tr>
            </thead>
            <tbody>
                <tr key={`${searchResult.barcode}-table-row-search`}>
                    <td key={`${searchResult.barcode}-${searchResult.id}`}>
                        {searchResult.id}
                    </td>
                    <td key={searchResult.barcode}>
                        {searchResult.barcode}
                    </td>
                    <td key={`${searchResult.barcode}-${searchResult.title}`}>
                        {searchResult.title}
                    </td>
                    <td key={`${searchResult.barcode}-${searchResult.description}`}>
                        {searchResult.description}
                    </td>
                    <td key={`${searchResult.barcode}-${searchResult.genre}`}>
                        {searchResult.genre}
                    </td>
                    <td key={`${searchResult.barcode}-${searchResult.year}`}>
                        {searchResult.year}
                    </td>
                    <td key={`${searchResult.barcode}-coverfront`}>
                        { imageCoverFront && imageCoverFront.length > 0 ? (
                            <img src={`data:image/jpeg;base64,${imageCoverFront}`} alt={`${searchResult.title} front cover`} className="cover-front" />
                        ) : (
                            <>No image available</>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}