import Image from 'next/image'

export default function TapeImage({tape, layout}: {tape: any, layout: string}) {

    let imageWidth = "archive" === layout ? 178 : 402
    let imageHeight = "archive" === layout ? 267 : 726      
    
    return (
        <>
            <Image
                src={tape.cover_front_url}
                alt={`${tape.title} front cover`}
                sizes="(min-width: 1024px) 768px, 180px"
                quality={90}
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
