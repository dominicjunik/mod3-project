import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// declaring an object with all the form values empty for the default state
let emptyForm = {
    username: '',
    password: '',
    email: ''
}

export default function Register({ setUser }) {

    // to redirect after form submission
    const navigate = useNavigate()
    // state variable to control the form values
    let [form, setForm] = useState(emptyForm)

    // function to update state when a form is changed
    function handleChange(event) {
        // spread the form and then edit the relevent keys using bracket object notation
        setForm({...form, [event.target.name]: event.target.value})
    }

    async function handleSubmit(event){
        // ALWAYS PREVENT THE RELOAD 
        event.preventDefault()

        try {
            // step 1: we make a request to create a new user
            const authResponse = await axios.post('/auth/register', form)
            // extract the token from the response of the register
            const token = authResponse.data.token

            // if theres no token, reset form and stop the function
            if (!token) {
                setForm(emptyForm)
                return
            }
            // save the token in local storage
            localStorage.setItem("token", token)
            
            //step 2: using the token in local storage we make a request to get the user information
            const userResponse = await axios.get('/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // save the user data in the state
            setUser(userResponse.data)
            // redirect to the main page
            navigate('/posts')
        } catch(error) {
            console.log(error.message)
            alert('username already exists')
        }
    }
    return (
        <div className=''>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <br />
                <input 
                    type="text" 
                    id="username"
                    name="username"
                    onChange={handleChange}
                    value={form.username}
                />
                <br /><br />
                <label htmlFor="email">Email:</label>
                <br />
                <input 
                    type="email" 
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={form.email}
                />
                <br /><br />
                <label htmlFor="password">Password:</label>
                <br />
                <input 
                    type="password" 
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={form.password}
                />
                <br /><br />
                <button>Submit</button>
            </form>
        </div>
    )
}