export default function TapeImage({tape}: {tape: any}) {
    
    return (
        <img
            src={`data:image/jpeg;base64,${Buffer.from(tape.coverfront.substring(2), 'hex').toString('base64')}`}
            alt={`${tape.title} front cover`}
            className="cover-front"
        />
    )
}