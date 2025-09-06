# React API Integration Guide for Note App

This guide shows how to integrate the Note App API with your React application.

## 📋 API Endpoints Summary

- **Base URL**: `http://localhost:3000/api/v1`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

### Authentication Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Note Endpoints (Protected)
- `POST /note/add` - Create note
- `GET /note/notes` - Get all user notes
- `GET /note/notes/:id` - Get specific note
- `PUT /note/update/:id` - Update note
- `DELETE /note/delete/:id` - Delete note

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install axios
# or
yarn add axios
```

### 2. Create API Service File
Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Authentication Services

### Create `src/services/authService.js`:

```javascript
import api from './api';

export const authService = {
  // Register new user
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
```

## 📝 Note Services

### Create `src/services/noteService.js`:

```javascript
import api from './api';

export const noteService = {
  // Create new note
  async createNote(noteData) {
    try {
      const response = await api.post('/note/add', noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all user notes
  async getAllNotes() {
    try {
      const response = await api.get('/note/notes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get specific note by ID
  async getNoteById(noteId) {
    try {
      const response = await api.get(`/note/notes/${noteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update note
  async updateNote(noteId, noteData) {
    try {
      const response = await api.put(`/note/update/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete note
  async deleteNote(noteId) {
    try {
      const response = await api.delete(`/note/delete/${noteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
```

## 🎯 React Components Examples

### 1. Login Component

```jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(formData);
      onLogin(); // Callback to parent component
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### 2. Signup Component

```jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cPassword: '',
    phone: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signup(formData);
      onSignup(); // Callback to parent component
    } catch (error) {
      setError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="cPassword"
            value={formData.cPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Phone (optional):</label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label>Age (optional):</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
```

### 3. Notes List Component

```jsx
import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getAllNotes();
      setNotes(response.notes);
    } catch (error) {
      setError(error.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(noteId);
        setNotes(notes.filter(note => note._id !== noteId));
      } catch (error) {
        setError(error.message || 'Failed to delete note');
      }
    }
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="notes-list">
      <h2>My Notes ({notes.length})</h2>
      
      {notes.length === 0 ? (
        <p>No notes found. Create your first note!</p>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.desc}</p>
              <div className="note-meta">
                <small>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
                <small>Updated: {new Date(note.updatedAt).toLocaleDateString()}</small>
              </div>
              <div className="note-actions">
                <button onClick={() => handleDelete(note._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
```

### 4. Create/Edit Note Component

```jsx
import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';

const NoteForm = ({ noteId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    desc: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const response = await noteService.getNoteById(noteId);
      setFormData({
        title: response.note.title,
        desc: response.note.desc
      });
    } catch (error) {
      setError(error.message || 'Failed to fetch note');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (noteId) {
        await noteService.updateNote(noteId, formData);
      } else {
        await noteService.createNote(formData);
      }
      onSave(); // Callback to parent component
    } catch (error) {
      setError(error.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-form">
      <h2>{noteId ? 'Edit Note' : 'Create New Note'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Description:</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (noteId ? 'Update Note' : 'Create Note')}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
```

### 5. Main App Component

```jsx
import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import Login from './components/Login';
import Signup from './components/Signup';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser());
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser(authService.getCurrentUser());
  };

  const handleSignup = () => {
    setShowSignup(false);
    // User can now login
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleCreateNote = () => {
    setEditingNoteId(null);
    setShowNoteForm(true);
  };

  const handleEditNote = (noteId) => {
    setEditingNoteId(noteId);
    setShowNoteForm(true);
  };

  const handleNoteSaved = () => {
    setShowNoteForm(false);
    setEditingNoteId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        {showSignup ? (
          <Signup onSignup={handleSignup} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <button onClick={() => setShowSignup(!showSignup)}>
          {showSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>My Notes App</h1>
        <div className="user-info">
          Welcome, {user?.name}!
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main>
        {showNoteForm ? (
          <NoteForm
            noteId={editingNoteId}
            onSave={handleNoteSaved}
            onCancel={() => setShowNoteForm(false)}
          />
        ) : (
          <>
            <button onClick={handleCreateNote} className="create-note-btn">
              Create New Note
            </button>
            <NotesList onEditNote={handleEditNote} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
```

## 🎨 CSS Styling (Optional)

```css
/* Add to your CSS file */
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.login-container, .signup-container, .note-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.note-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.note-actions {
  margin-top: 10px;
}

.note-actions button {
  margin-right: 10px;
  padding: 5px 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-note-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.form-actions {
  margin-top: 15px;
}

.form-actions button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0 15px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

label {
  font-weight: bold;
}
```

## 🚀 Getting Started

1. **Install dependencies**: `npm install axios`
2. **Copy the service files** to your React project
3. **Create the components** using the examples above
4. **Start your React app**: `npm start`
5. **Make sure your API server is running**: `npm run dev` (in the Note App directory)

## 📝 API Request Examples

### Using fetch (alternative to axios):

```javascript
// Login example
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.message);
  }
};

// Create note example
const createNote = async (title, desc) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/v1/note/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, desc }),
  });
  
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};
```

This guide provides everything you need to integrate your Note App API with React! 🎉
