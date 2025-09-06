# 📝 Note App

A modern, responsive note-taking application built with React that helps you organize your thoughts and ideas in one place.

## ✨ Features

- **Create & Edit Notes**: Write, edit, and organize your notes with a clean, intuitive interface
- **User Authentication**: Secure login and registration system with JWT tokens
- **Real-time Updates**: See your changes instantly without page refreshes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, modern interface with smooth animations and transitions
- **Search & Filter**: Find your notes quickly with built-in search functionality
- **Statistics**: Track your note-taking activity with helpful statistics

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd NoteApp_React
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the app in action!

## 🛠️ Built With

- **React 18** - Modern React with hooks and functional components
- **Bootstrap 5** - Responsive UI framework
- **Axios** - HTTP client for API requests
- **JWT Decode** - Token authentication
- **SweetAlert2** - Beautiful alert dialogs
- **Font Awesome** - Icon library
- **React Router** - Client-side routing

## 📱 How to Use

1. **Register** a new account or **login** with existing credentials
2. **Create** your first note by clicking the "Add New Note" button
3. **Edit** any note by clicking the edit icon
4. **Delete** notes you no longer need
5. **Search** through your notes using the search bar
6. **View statistics** about your note-taking activity

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🌐 API Integration

This app connects to a Node.js backend API for:
- User authentication and authorization
- CRUD operations for notes
- Data persistence and retrieval

## 📄 Project Structure

```
src/
├── Components/
│   ├── Home.jsx          # Main notes interface
│   ├── Login.jsx         # Login component
│   ├── Register.jsx      # Registration component
│   ├── Navbar.jsx        # Navigation bar
│   └── ErrorBoundary.jsx # Error handling
├── App.js               # Main app component
├── App.css              # Global styles
└── index.js             # App entry point
`
