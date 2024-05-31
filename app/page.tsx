import Link from 'next/link'

export default async function Home( req: any ) {
    return (
        <>
            <div className="page-section container-narrow">
                <h2>What is Revival Video?</h2>
                <p>I love VHS tapes, and while my collection is meager I still wanted an easy way to keep track of it. In my head, I imagined something like <Link href="https://www.discogs.com/">Discogs</Link> – a database of tapes with the ability to add tapes to your own collection.</p>

                <p>The first step in this, for me, is to add all of my tapes to the library. Then, I want to invite in some fellow collectors to build their libraries, add their own tapes, and generally stress test the system.</p>

                <p>Then, I want to open it up to everybody to use similar to Discogs: a user-driven VHS library where we can all build and share our collections.</p>
            </div>
        </>
    )
}