# Courtroom Navigator System

A comprehensive digital solution for legal professionals to manage court cases, hearings, documents, and proceedings efficiently.

## Application Structure

The application follows a modern React architecture with the following key components:

### Pages
- **LandingPage**: Public-facing welcome page with feature overview and calls to action
- **Auth**: Authentication page with login/registration functionality
- **Dashboard**: Main dashboard for authenticated users
- **CaseManagement**: Manage, search, and filter court cases
- **Calendar**: Schedule and view court hearings and appointments
- **Documents**: Upload, organize, and access case-related documents
- **Profile**: User profile management
- **Settings**: Application settings

### User Flow
1. Users arrive at the Landing Page where they learn about the system
2. From the Landing Page, users can login or register
3. After authentication, users are directed to the Dashboard
4. From the Dashboard, users can access all main features of the application
5. The TopBar provides global search and user account access
6. The Sidebar offers navigation between main application sections

### Key Features
- Case Management
- Court Calendar
- Document Repository
- Client Portal access
- Secure & Compliant data handling
- Specialized tools for judges and legal staff

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui
- **Routing**: React Router
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **State Management**: React Query + React Context

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase project (for authentication and database)

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/courtroom-navigator-system.git
cd courtroom-navigator-system
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to http://localhost:8080

## Development Guidelines

- Use TypeScript for type safety
- Follow the existing component structure and design patterns
- Use the UI component library for consistent design
- Implement proper error handling and loading states
- Write descriptive commit messages

## License

[MIT License](LICENSE)
