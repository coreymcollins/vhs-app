export default function AccountForm() {
    
    return (
        <div>
            <form action="/auth/signout" method="post">
                <button className="button block" type="submit">
                    Sign out
                </button>
            </form>
        </div>
    )
}