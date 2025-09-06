import axios from 'axios'
import jwt_decode from 'jwt-decode'
import React, { useEffect, useState, useCallback } from 'react'
import Swal from 'sweetalert2';


export default function Home() {
  let baseUrl='https://note-app-node-js.vercel.app/api/v1/';
  const[notes,setNotes]=useState([])
  const[note,setNote]=useState({"title":"","desc":""})
  const[loading,setLoading]=useState(true)
  const[error,setError]=useState(null)
  const[userID,setUserID]=useState(null)
  const[token,setToken]=useState(null)
  const[isAddingNote,setIsAddingNote]=useState(false)
  const[isUpdatingNote,setIsUpdatingNote]=useState(false)
  const[successMessage,setSuccessMessage]=useState(null)

  // Helper function to close modals
  const closeModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = window.bootstrap?.Modal?.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        // Fallback: trigger the close button
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) closeButton.click();
      }
    }
  };

  // Initialize token and user data
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        
        if (!storedToken) {
          setError("No authentication token found. Please login.");
          setLoading(false);
          return;
        }

        const decoded = jwt_decode(storedToken);
        
        if (!decoded) {
          setError("Invalid token format. Please login again.");
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.log('Token is expired!');
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Check for user ID in various possible fields
        const userId = decoded._id || decoded.id || decoded.userId || decoded.user_id;
        
        if (!userId) {
          setError("Token missing user ID. Please login again.");
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        setToken(storedToken);
        setUserID(userId);
        setNote(prev => ({...prev, userID: userId, token: storedToken}));
        setError(null);
      } catch (error) {
        console.error("Token validation error:", error);
        setError("Invalid token format. Please login again.");
        localStorage.removeItem("Token");
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);

  const getUserNote = useCallback(async () => {
    if (!userID || !token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get all notes for the authenticated user
      let {data} = await axios.get(baseUrl+"note/notes",{
        headers:{
          Authorization: `Bearer${token}`
        }
      });
      
      if(data?.message === "Notes retrieved successfully"){
        setNotes(data.notes || []);
        setError(null);
      } else {
        // If unexpected response, show empty state
        setNotes([]);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      
      if (error.response?.status === 401) {
        setNotes([]);
        setError(null);
      } else if (error.response?.status === 404) {
        setNotes([]);
        setError(null);
      } else {
        setNotes([]);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, [userID, token, baseUrl]);

  // Fetch notes when userID and token are available
  useEffect(() => {
    if (userID && token) {
      getUserNote();
    } else if (userID && token === null) {
      // If we have userID but no token, still show the interface
      setLoading(false);
    }
  }, [userID, token, getUserNote]);
  
  
function getNote({target}){
  setNote({...note,[target.name]:target.value})
 
} 
 async function addNote (e){
e.preventDefault()
  
  // Validate note data
  if (!note.title.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Title Required',
      text: 'Please enter a title for your note.',
      confirmButtonColor: '#1ab188'
    });
    return;
  }
  
  if (!note.desc.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Content Required',
      text: 'Please enter some content for your note.',
      confirmButtonColor: '#1ab188'
    });
    return;
  }

  setIsAddingNote(true);
  setError(null);
  
  try {
    const noteData = {
      title: note.title.trim(),
      desc: note.desc.trim()
      // userID is extracted from JWT token by backend, not needed in request body
    };
    // Debug: Log the exact Authorization header being sent
    const authHeader = `Bearer${token}`;
    console.log('Authorization header being sent:', authHeader);
    console.log('Token length:', token?.length);
    console.log('Token starts with:', token?.substring(0, 20));
    
    const response = await axios.post(baseUrl+"note/add", noteData, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    const {data} = response;

    if(data?.message === "Note created successfully"){
      // Success flow
      document.getElementById('add-form').reset();
      setNote({"title":"","desc":"","userID":userID,"token":token});
      
      // Show success message
      setSuccessMessage("Note created successfully!");
      
      // Close modal
      closeModal('exampleModal');
      
      // Refresh notes list
      await getUserNote();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Show success toast
      Swal.fire({
        icon: 'success',
        title: 'Note Created!',
        text: 'Your note has been saved successfully.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
    } else {
      throw new Error(data?.message || 'Failed to create note');
    }
  } catch (error) {
    console.error("Error creating note:", error);
    
    // Handle different error types
    if (error.response?.status === 401) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("Token");
    } else if (error.response?.status === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Data',
        text: error.response.data?.message || 'Please check your input and try again.',
        confirmButtonColor: '#1ab188'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create note. Please try again.',
        confirmButtonColor: '#1ab188'
      });
    }
  } finally {
    setIsAddingNote(false);
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
        axios.delete(baseUrl+'note/delete/'+NoteID,{
        headers:{
          Authorization: `Bearer${token}`
        }
        }).then((response)=>{
        if(response.data?.message==="deleted"){

Swal.fire(
  'Deleted!',
  'Your file has been deleted.',
  'success'
)
getUserNote();
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
  document.querySelector('#exampleModal1 input' ).value=notes[NoteIndex].title;
  document.querySelector('#exampleModal1 textarea' ).value=notes[NoteIndex].desc;
  setNote({...note,'title':notes[NoteIndex].title,"des":notes[NoteIndex].desc,NoteID:notes[NoteIndex]._id});
}
async function updateNote(e){
  e.preventDefault()
  
  // Validate note data
  if (!note.title.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Title Required',
      text: 'Please enter a title for your note.',
      confirmButtonColor: '#1ab188'
    });
    return;
  }
  
  if (!note.desc.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Content Required',
      text: 'Please enter some content for your note.',
      confirmButtonColor: '#1ab188'
    });
    return;
  }

  setIsUpdatingNote(true);
  
  try {
    const noteData = {
      title: note.title.trim(),
      desc: note.desc.trim()
      // userID is extracted from JWT token by backend, not needed in request body
    };

    let{data} = await axios.put(baseUrl+'note/update/'+note._id, noteData, {
    headers:{
        Authorization: `Bearer${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if(data?.message === "updated"){
      // Success flow
      document.getElementById('edit-form').reset();
      
      // Close modal
      closeModal('exampleModal1');
      
      // Refresh notes list
      await getUserNote();
      
      // Show success toast
      Swal.fire({
        icon: 'success',
        title: 'Note Updated!',
        text: 'Your note has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      throw new Error(data?.message || 'Failed to update note');
    }
  } catch (error) {
    console.error("Error updating note:", error);
    
    if (error.response?.status === 401) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("Token");
    } else {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update note. Please try again.',
        confirmButtonColor: '#1ab188'
      });
    }
  } finally {
    setIsUpdatingNote(false);
  }
}
  // Show loading state
  if (loading) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="page-header">
              <div className="text-center py-5">
                <div className="loading-spinner mx-auto mb-3"></div>
                <h3 className="text-white">Loading your notes...</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="page-header">
              <div className="text-center py-5">
                <i className="fas fa-exclamation-triangle text-warning mb-3" style={{fontSize: '3rem'}}></i>
                <h3 className="text-white mb-3">Authentication Error</h3>
                <p className="text-white-50 mb-4">{error}</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary modern-add-btn"
                    onClick={() => window.location.href = '/login'}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Go to Login
                  </button>
                  <button 
                    className="btn btn-secondary modern-btn-secondary"
                    onClick={() => window.location.href = '/register'}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
 <>
         <div className="container my-5">
                <div className="row">
                    <div className="col-12">
                        {/* Enhanced Header Section */}
                        <div className="page-header">
                            <div className="page-header-content">
                                <div className="page-header-text">
                                <h1 className="page-title">My Notes</h1>
                                    <p className="page-subtitle">Organize your thoughts and ideas in one place</p>
                            </div>
                                <div className="page-header-actions">
                            <button 
                                className="btn btn-primary modern-add-btn" 
                                data-bs-toggle="modal" 
                                data-bs-target="#exampleModal"
                                aria-label="Add a new note"
                            >
                                <i className="fas fa-plus-circle me-2" aria-hidden="true"></i>
                                <span>Add New Note</span>
                            </button>
                                </div>
                            </div>
                            
                            {/* Success Message */}
                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                                    <i className="fas fa-check-circle me-2"></i>
                                    {successMessage}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setSuccessMessage(null)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}

                            
                            {/* Note Statistics */}
                            <div className="note-stats">
                                <div className="stat-item">
                                    <i className="fas fa-sticky-note stat-icon" aria-hidden="true"></i>
                                    <span className="stat-number">{notes.length}</span>
                                    <span>Total Notes</span>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-clock stat-icon" aria-hidden="true"></i>
                                    <span className="stat-number">{notes.filter(note => new Date(note.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</span>
                                    <span>This Week</span>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-chart-line stat-icon" aria-hidden="true"></i>
                                    <span className="stat-number">{notes.reduce((total, note) => total + (note.desc?.length || 0), 0)}</span>
                                    <span>Characters</span>
                                </div>
                            </div>
                            
                            {/* Search and Filter Section */}
                            <div className="search-filter-section">
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search your notes..."
                                    aria-label="Search notes"
                                />
                                <button className="filter-btn" aria-label="Filter notes">
                                    <i className="fas fa-filter" aria-hidden="true"></i>
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
              {/* <!-- Add Modal --> */}
               <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="addNoteModalLabel" aria-hidden="true">
                <form id="add-form" onSubmit={addNote}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content modern-modal">
                            <div className="modal-header modern-modal-header">
                                <h5 className="modal-title" id="addNoteModalLabel">
                                    <i className="fas fa-plus-circle me-2" aria-hidden="true"></i>
                                    Create New Note
                                </h5>
                                <button type="button" className="btn-close modern-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body modern-modal-body">
                                <div className="form-group mb-3">
                                    <label htmlFor="noteTitle" className="form-label">
                                        <i className="fas fa-heading me-2" aria-hidden="true"></i>
                                        Note Title
                                    </label>
                                    <input 
                                        id="noteTitle"
                                        onChange={getNote} 
                                        placeholder="Enter a descriptive title for your note" 
                                        name="title" 
                                        className="form-control modern-input" 
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="noteContent" className="form-label">
                                        <i className="fas fa-edit me-2" aria-hidden="true"></i>
                                        Note Content
                                    </label>
                                    <textarea 
                                        id="noteContent"
                                        onChange={getNote} 
                                        className="form-control modern-textarea" 
                                        placeholder="Write your note content here..." 
                                        name="desc"  
                                        rows="8"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer modern-modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary modern-btn-secondary" 
                                    data-bs-dismiss="modal"
                                    disabled={isAddingNote}
                                >
                                    <i className="fas fa-times me-2" aria-hidden="true"></i>
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary modern-btn-primary"
                                    disabled={isAddingNote}
                                >
                                    {isAddingNote ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                    <i className="fas fa-plus-circle me-2" aria-hidden="true"></i>
                                    Create Note
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div> 
              {/* <!-- Edit Modal --> */}
              <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="editNoteModalLabel" aria-hidden="true">
                <form onSubmit={updateNote} id="edit-form">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content modern-modal">
                            <div className="modal-header modern-modal-header">
                                <h5 className="modal-title" id="editNoteModalLabel">
                                    <i className="fas fa-edit me-2" aria-hidden="true"></i>
                                    Edit Note
                                </h5>
                                <button type="button" className="btn-close modern-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body modern-modal-body">
                                <div className="form-group mb-3">
                                    <label htmlFor="editNoteTitle" className="form-label">
                                        <i className="fas fa-heading me-2" aria-hidden="true"></i>
                                        Note Title
                                    </label>
                                    <input 
                                        id="editNoteTitle"
                                        onChange={getNote} 
                                        placeholder="Enter a descriptive title for your note" 
                                        name="title" 
                                        className="form-control modern-input" 
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editNoteContent" className="form-label">
                                        <i className="fas fa-edit me-2" aria-hidden="true"></i>
                                        Note Content
                                    </label>
                                    <textarea 
                                        id="editNoteContent"
                                        onChange={getNote} 
                                        className="form-control modern-textarea" 
                                        placeholder="Write your note content here..." 
                                        name="desc"  
                                        rows="8"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer modern-modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary modern-btn-secondary" 
                                    data-bs-dismiss="modal"
                                    disabled={isUpdatingNote}
                                >
                                    <i className="fas fa-times me-2" aria-hidden="true"></i>
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary modern-btn-primary"
                                    disabled={isUpdatingNote}
                                >
                                    {isUpdatingNote ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                    <i className="fas fa-save me-2" aria-hidden="true"></i>
                                    Update Note
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
                           
                <div className="container"> 
                    {notes.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-sticky-note empty-icon" aria-hidden="true"></i>
                                <h3 className="empty-title">No notes yet</h3>
                            <p className="empty-subtitle">Start organizing your thoughts and ideas by creating your first note</p>
                                <button 
                                    className="btn btn-primary modern-add-btn" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#exampleModal"
                                aria-label="Create your first note"
                                >
                                    <i className="fas fa-plus-circle me-2" aria-hidden="true"></i>
                                    Create Your First Note
                                </button>
                        </div>
                    ) : (
                        <div className="notes-grid">
                            {/* Quick Add Card */}
                            <div 
                                className="quick-add-card"
                                data-bs-toggle="modal" 
                                data-bs-target="#exampleModal"
                                aria-label="Add a new note"
                            >
                                <i className="fas fa-plus-circle quick-add-icon" aria-hidden="true"></i>
                                <p className="quick-add-text">Add New Note</p>
                            </div>
                            
                            {/* Existing Notes */}
                            {notes.map((note, index) => {
                            return (
                                    <div key={index} className="note-card modern-note">
                                        <div className="note-header">
                                            <h3 className="note-title" title={note.title}>{note.title}</h3>
                                            <div className="note-actions">
                                                <button 
                                                    onClick={()=>{getNoteID(index)}} 
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#exampleModal1"
                                                    className="btn btn-sm btn-outline-primary note-action-btn"
                                                    aria-label={`Edit note: ${note.title}`}
                                                    title="Edit this note"
                                                >
                                                    <i className="fas fa-edit" aria-hidden="true"></i>
                                                </button>
                                                <button 
                                                    onClick={()=>{deleteNote(note._id)}} 
                                                    className="btn btn-sm btn-outline-danger note-action-btn"
                                                    aria-label={`Delete note: ${note.title}`}
                                                    title="Delete this note"
                                                >
                                                    <i className="fas fa-trash-alt" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="note-content">
                                            <p className="note-text" title={note.desc}>{note.desc}</p>
                                        </div>
                                        <div className="note-footer">
                                            <div className="note-meta">
                                            <small className="note-date">
                                                <i className="fas fa-clock me-1" aria-hidden="true"></i>
                                                    {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Created recently'}
                                                </small>
                                                <small className="note-length">
                                                    <i className="fas fa-text-width me-1" aria-hidden="true"></i>
                                                    {note.desc?.length || 0} chars
                                            </small>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                                </div>
                    )}
                </div>
            
            {/* Floating Action Button */}
            <button 
                className="fab"
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal"
                aria-label="Add a new note"
                title="Add New Note"
            >
                <i className="fas fa-plus" aria-hidden="true"></i>
            </button>
            
 </>
  )
}
