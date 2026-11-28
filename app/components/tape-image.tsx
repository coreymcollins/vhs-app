import Image from 'next/image'

export default function TapeImage({tape, layout, priority, side}: {tape: any, layout: string, priority: boolean, side: string}) {

    // Set variables
    let imageSettings = {
        width: layout === 'archive' ? 168 : 384,
        height: layout === 'archive' ? 304 : 693,
    }

    const imageUrl = tape[`cover_${side}_url`]
    
    return (
        <>
            <Image
                src={imageUrl}
                alt={`${tape.title} front cover`}
                sizes={`(min-width: 1024px) ${imageSettings.width}px, 155px`}
                quality={85}
                priority={priority}
                width={imageSettings.width}
                height={imageSettings.height}
                className={`tape-cover-${side}`}
            />
        </>
    )
}
