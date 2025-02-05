# Event Management System

## Overview
This application is a full-stack event management system built using Node.js for the backend and Vue 3 for the frontend. It allows users to register for events, track attendance, and generate reports in XLSX format. The system supports two types of users: **event organizers** and **participants**. Organizers can manage events and keep track of participants, while participants can register for multiple events. A scheduled cron job runs every minute to automatically open and close events based on their scheduled dates.

## Technologies Used

### Backend (Node.js)
- **Express.js** - RESTful API framework
- **Firebase Firestore** - NoSQL database for storing event and user data
- **Firebase Authentication** - User authentication and management
- **JWT (JSON Web Token)** - Secure user authentication
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variable management
- **Node-cron** - Task scheduling for event status updates
- **XLSX** - Generating Excel reports

### Frontend (Vue 3)
- **Vue.js (Composition API)** - Modern approach to state and component management
- **Vue Router** - Navigation and routing
- **Vuex** - Centralized state management
- **Firebase SDK** - Integrating authentication and Firestore

## Features

### Authentication & Authorization
- Firebase Authentication for secure user login and registration
- JWT-based authentication for API requests
- Role-based access control (Organizer vs. Participant)

### Event Management
- Organizers can create, edit, update and delete events
- Participants can register for multiple events
- Real-time updates on event availability
- Automated event opening/closing via cron job

### Attendance Tracking
- Organizers can track attendance
- Export participant data as XLSX files
- Real-time updates on participant check-ins

### Error Handling & Validation
- Middleware-based authentication for secure API access
- Server-side validation for event registration and authentication
- Client-side validation with user-friendly error messages
- Standardized HTTP response codes for API interactions

### User Experience
- Responsive layout for desktop and mobile devices
- Visual feedback for errors and form validations
- Intuitive UI for event browsing and registration


