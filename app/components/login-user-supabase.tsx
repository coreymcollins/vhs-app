import { login, signup } from '../login/actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}

// 'use client'

// import { useState } from 'react';
// import { supabase } from '../lib/supabase';

// const initialState = {
//     message: 'All fields are required.',
// };

// export function Login() {
//     const [state, setState] = useState(initialState);

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
        
//         const formData = new FormData(event.currentTarget);
//         const email = formData.get( 'emailsb' ) as string;
//         const password = formData.get( 'passwordsb' ) as string;
//         const { data: { user } } = await supabase.auth.getUser()

//         try {
//             let { data, error } = await supabase.auth.signInWithPassword({
//                 email: email,
//                 password: password
//             })

//             if ( error ) {
//                 throw error;
//             }

//             if ( user ) {
//                 setState({ message: `User logged in successfully as user ${user.email}` })
//             } else if ( ! user ) {
//                 setState({ message: 'User not logged in' })
//             }
//         } catch ( error ) {
//             setState({ message: 'User could not be logged in' })
//         }
//     };

//     return (
//         <>
//             <h2>Login to supabase</h2>
//             <form onSubmit={handleSubmit} className="login-form form">
//                 <label htmlFor="emailsb">Email</label>
//                 <input type="email" id="emailsb" name="emailsb" required />
                
//                 <label htmlFor="passwordsb">Password</label>
//                 <input type="password" id="passwordsb" name="passwordsb" required />

//                 <button type="submit">Log In</button>
                
//                 <p aria-live="polite" role="status">
//                     {state.message}
//                 </p>
//             </form>
//         </>
//     );
// }
