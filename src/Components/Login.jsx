import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function Login() {
    let baseURL='https://route-movies-api.vercel.app/'
    
    let navigate=useNavigate()
const [user,setUser]=useState({"email":"","password":""})
const [error,setError]=useState("")
const[isLoading,setIsLoading]=useState(false)
 async function logIn(e){
    e.preventDefault()
    setIsLoading(true)
    let {data}=await axios.post(baseURL+'signin',user)
    setIsLoading(false)

    if(data.message=="success"){
        localStorage.setItem("Token",data.token)//3
navigate('/home')
    }else{
        setError(data.message)
    }
}
function getUser(e){
setUser({...user,
    
    [e.target.name]:e.target.value})
}
  return (
    <>
    <div className="container my-5 py-5">
                <div className="col-md-5 m-auto text-center">
                    <form onSubmit={logIn} >
                      
                        <div className="form-group">
                            <input onChange={getUser} placeholder="Enter email" type="email" name="email" className="form-control" />
                        </div>
                        <div className="form-group my-2">
                            <input onChange={getUser}  placeholder="Enter you password" type="password" name="password" className=" form-control" />
                        </div>
                        <button type="submit" className={'btn btn-info w-100'+ (isLoading? " disabled":"")}> {isLoading? <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> : 'Login'}  </button>

                        {error&& <div className="alert alert-danger mt-2">
                        {  error}
                        </div>}
                    </form>
                </div>
            </div>
    </>
  )
}
