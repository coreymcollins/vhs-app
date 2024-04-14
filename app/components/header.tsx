import Link from 'next/link'
import Image from 'next/image'

export default function PageHeader() {
    return (
        <header className="site-header">
            <Link href="/">
                <Image
                    src="/revival.webp"
                    priority
                    width={640}
                    height={84}
                    alt="Revival Video logo"
                    className="site-logo"
                />
            </Link>
            <h1>Revival Video VHS Library</h1>
        </header>
    )
}
