import Image from 'next/image'

export default function TapeImage({tape, layout}: {tape: any, layout: string}) {

    let imageWidth = "archive" === layout ? 168 : 402
    let imageHeight = "archive" === layout ? 304 : 726      
    
    return (
        <>
            <Image
                src={tape.cover_front_url}
                alt={`${tape.title} front cover`}
                sizes="(min-width: 1024px) 768px, 155px"
                quality={85}
                priority={true}
                style={{
                    width: '100%',
                    height: 'auto'
                }}
                width={imageWidth}
                height={imageHeight}
                className="tape-coverfront"
            />
        </>
    )
}
