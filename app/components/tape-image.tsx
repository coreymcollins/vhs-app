import Image from 'next/image'

export default function TapeImage({tape, layout, priority}: {tape: any, layout: string, priority: boolean}) {

    // Set variables
    let imageSettings = {
        width: layout === 'archive' ? 168 : 384,
        height: layout === 'archive' ? 304 : 693,
    }
    
    return (
        <>
            <Image
                src={tape.cover_front_url}
                alt={`${tape.title} front cover`}
                sizes={`(min-width: 1024px) ${imageSettings.width}px, 155px`}
                quality={85}
                priority={priority}
                width={imageSettings.width}
                height={imageSettings.height}
                className="tape-coverfront"
            />
        </>
    )
}
