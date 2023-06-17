import axios from 'axios'
import jwt_decode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';


export default function Home() {
  let baseUrl='https://route-movies-api.vercel.app/';
  let token = localStorage.getItem("token")
  let decoded=jwt_decode(token)
  let userID =decoded._id
  const[notes,setNotes]=useState([])
  const[note,setNote]=useState({"title":"","desc":"",userID,token})   //18

 async function getUserNote(){
    let {data}= await axios.get(baseUrl+"getUserNotes",{
     
      headers:{
        userID,
        Token:token
      }
    })

    if(data?.message==='success'){
   
setNotes(data.Notes)

    }
    console.log(notes)
  }
  useEffect(
    ()=>{getUserNote()},[])
  
  
function getNote({target}){
  setNote({...note,[target.name]:target.value})
 
} 
 async function addNote (e){
e.preventDefault()
let{data}=await axios.post(baseUrl+"addNote",note)
if(data?.message==="success"){
  document.getElementById('add-form').reset()
 
  getUserNote()
}
}
 function deleteNote(    NoteID){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
        axios.delete(baseUrl+'deleteNote',{
        data:{
          token,
       NoteID
        }
      }).then((response)=>{
        if(response.data?.message==="deleted"){
getUserNote();
Swal.fire(
  'Deleted!',
  'Your file has been deleted.',
  'success'
)
        }else{
         
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.data?.message,
         
          })
        }
        })
   
    }
  })
}
function getNoteID(NoteIndex){
  document.querySelector('#exampleModal1 input' ).value=notes[NoteIndex].title,
document.querySelector('#exampleModal1 textarea' ).value=notes[NoteIndex].desc
setNote({...note,'title':notes[NoteIndex].title,"des":notes[NoteIndex].desc,NoteID:notes[NoteIndex]._id})
}
async function updateNote(e){
  e.preventDefault()
  let{data}= await axios.put(baseUrl+'updateNote',note)
  if(data?.message==="updated"){
    getUserNote()
    Swal.fire('updated',
    'your Note has been updated',
    'success')
  }else{
    Swal.fire({
      icon:"error",
     title:"Oops...",
     text:'Something went wrong '
    })
  }
}
  return (
 <>
         <div className="container my-5">
                <div className="col-md-12 text-end">
                    <a className="add p-2 btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add
                        New</a>
                </div>
            </div>
              {/* <!-- Add Modal --> */}
               <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form id="add-form" onSubmit={addNote}>  {/*19*/}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                               {/*16*/} <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc"  cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div> 
              {/* <!-- Edit Modal --> */}
              <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={updateNote} id="edit-form">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info">Update Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
                           
                <div className="container"> 
                <div className="row">
                    {notes.map((note, index) => {
                        return (
                         
                            <div key={index} className="col-md-4 my-4">
                                <div className="note p-4">
                                    <h3 className="float-start">{note.title}</h3>
                                    <a onClick={()=>{getNoteID(index)}} data-bs-toggle="modal" data-bs-target="#exampleModal1" ><i className="fas fa-edit float-end   edit"></i></a>
                                    <a onClick={()=>{deleteNote(note._id)}} > <i className="fas fa-trash-alt float-end  px-3 del"></i></a>
                                    <span className="clearfix"></span>
                                    <p>{note.desc}</p>
                                </div>
                            </div>
                         
                        )
                    })}  


                </div>
            </div>
            
 </>
  )
}
