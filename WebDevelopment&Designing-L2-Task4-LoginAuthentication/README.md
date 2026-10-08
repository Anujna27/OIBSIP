# SecureSpace — Login Authentication System

A client-side authentication system built as part of the **Oasis Infobyte Web Development & Designing Internship**.

## Features

- User registration
- Username and email validation
- Password validation
- Minimum 8-character password
- At least one number required
- Duplicate username/email detection
- SHA-256 password hashing
- Login authentication
- Protected dashboard
- Login session using localStorage
- Logout functionality
- Responsive design
- Empty-field validation
- Generic incorrect-credentials error

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Web Crypto API
- Browser localStorage

## Project Structure

```text
WebDevelopment&Designing-L2-Task4-LoginAuthentication/
├── index.html
├── register.html
├── dashboard.html
├── style.css
├── script.js
└── README.md

Authentication Flow
Register
   ↓
Validate Details
   ↓
Hash Password
   ↓
Save User
   ↓
Login
   ↓
Validate Credentials
   ↓
Create Session
   ↓
Protected Dashboard
   ↓
Logout

Security Note
This project demonstrates client-side authentication for educational purposes.
Production authentication systems should use server-side password hashing, secure sessions, HTTPS, and proper backend authentication.
Internship
Organization: Oasis Infobyte
Track: Web Development & Designing
Level: 2
Task: 4 — Login Authentication System