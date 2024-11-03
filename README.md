# Contact Form Management System

This project aims to create a Contact Form Management System using React.js and Node.js, covering concepts like form validation, user authentication, authorization, data visualization, and user feedback.

## Features

- **Frontend**: React.js with form validation, authentication, and responsive design.
- **Backend**: Node.js server managing contact form submissions, user data, and access roles.
- **Roles**: "admin" and "reader" roles with specific access privileges.
- **Optional**: Dark/Light themes, multi-language support (English and Turkish), pagination, WebSocket, and NoSQL.

## Prerequisites

- **Backend Setup**
  - Navigate to `contact-form-management-server` directory.
  - Run `npm install` to install dependencies.
  - Start the server with `npm run start`.
  - Verify server at [http://localhost:5165](http://localhost:5165).

## Endpoints

- `/api/user/login` - Login and retrieve JWT token.
- `/api/user/check-login` - Validate JWT token.
- `/api/user/logout` - Log out user.
- `/api/countries` - Get list of countries.
- `/api/message/add` - Submit contact form.
- Additional endpoints for managing messages and users (admin only).

## Frontend

- Login, Not Authorized, Not Found pages with protected routing.
- Contact form for users with validations:
  - **Name**: max 50 characters
  - **Gender**: male/female radio button
  - **Country**: dropdown, populated from backend
  - **Message**: textarea, max 500 characters
- Side menu with links for "admin" and "reader" roles.
- User profile dropdown with logout button.
- Success/error messages (snack bars) for actions.
- Dark/Light theme, language support (en/tr).
- Pagination, and infinite scrolling.

## Reports (Admin Only)

- Message count by country (bar chart).
- Message count by gender (pie chart).


## Technologies

- **React.js**
- **Node.js**
- **MongoDB**
- **JWT for Authentication**
- **UI Framework**: Bootstrap
