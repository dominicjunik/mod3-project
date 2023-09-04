import axios from "axios"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Profile({user, setUser}) {
    const confirmDelete = useRef()
    // get more candy function
    // edit profile
    user.password = ""
    console.log(user)

    // to redirect after form submission
    const navigate = useNavigate()
    // state variable to control the form values
    let [form, setForm] = useState(user)

    // function to update state when a form is changed
    function handleChange(event) {
        // spread the form and then edit the relevent keys using bracket object notation
        setForm({...form, [event.target.name]: event.target.value})
    }

    async function handleSubmit(event){
        // ALWAYS PREVENT THE RELOAD 
        event.preventDefault()

        try {
            // step 1: make a put request to the server            
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
            alert('something bad')
        }
    }

    async function handleDelete(event){
        // ALWAYS PREVENT THE RELOAD 
        event.preventDefault()
        // structure the data into an object
        let payload = {password: confirmDelete.current.value}
        // console.log(`/auth/${user._id}`, payload)

        try {
            const deleteResponse = await axios.delete(`/auth/${user._id}`, { data: payload})
            console.log(deleteResponse)
            logout()
            alert(deleteResponse.data.message)


        } catch(error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    // simple logout function, clears the state variable and deletes the token => this causes all the routes to change
    function logout() {
        localStorage.removeItem("token");
        setUser({});
    }

return (
    <div className="flex flex-col items-center min-h-screen">
            <h1 className="mt-8 mb-4 sm:mt-36 text-4xl bg-black/90 px-2 pb-1 rounded-lg ">Profile</h1>
            <details>
                <summary className=" text-4xl bg-black/90 px-2 pb-1 rounded-lg text-center">EDIT</summary>
                <form onSubmit={handleSubmit} className="flex flex-col items-center bg-black/70 p-4 rounded-xl w-auto">
             
                <label htmlFor="email" className="text-xl bg-black/90 rounded-lg px-2 mt-2 mb-1">Email:</label>
                
                <input 
                    type="email" 
                    id="email"
                    name="email"
                    onChange={handleChange}
                    className="p-1 rounded-lg bg-black/80"
                    value={form.email}
                />
                
                <label htmlFor="password" className="text-xl bg-black/90 rounded-lg px-2 mt-2 mb-1">Password:</label>
                
                <input 
                    type="password" 
                    id="password"
                    name="password"
                    onChange={handleChange}
                    className="p-1 rounded-lg bg-black/80"
                    value={form.password}
                />
                
                <button className="m-2 text-2xl bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white">Submit</button>
            </form>
            </details>
            <details>
                <summary className=" text-4xl bg-black/90 px-2 pb-1 rounded-lg text-center">DELETE</summary>
                <form onSubmit={handleDelete} className="flex flex-col items-center bg-black/70 p-4 rounded-xl w-auto">
                <h2>Enter your password to confirm deletion</h2>
                <label htmlFor="password1" className="text-xl bg-black/90 rounded-lg px-2 mt-2 mb-1">Password:</label>
                
                <input 
                    type="password" 
                    id="password1"
                    name="password"
                    className="p-1 rounded-lg bg-black/80"
                    ref={confirmDelete}
                />
                
                <button className="m-2 text-2xl bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white">Submit</button>
            </form>
            </details>
           
        </div>
)
}