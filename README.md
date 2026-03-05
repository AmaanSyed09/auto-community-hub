# Car Community Event Platform

An Express + MongoDB MVC web app for creating car events, managing attendees, and tracking RSVP status.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS templating
- Express Session + Connect Mongo
- Multer (image upload)
- Express Validator
- Express Rate Limit
- Method Override
- Connect Flash

## Features

### Authentication and Session

- User signup with validation
- User login/logout
- Password hashing using `bcryptjs`
- Session-based authentication with Mongo-backed session store
- Guest-only and logged-in-only route guards

### User Management

- Create account with unique email check
- Login with email/password verification
- Profile page showing:
- Hosted events
- RSVPed events

### Event Management

- Create event (host must be logged in)
- Read all events and event details
- Update event (host only)
- Delete event (host only)
- Car category validation (enum-based)
- Date validation, including end date after start date
- Event image upload (`jpeg/png/gif`, size limit)

### RSVP System

- Logged-in users can RSVP to events with:
- `YES`
- `NO`
- `MAYBE`
- Host cannot RSVP to their own event
- RSVP is upserted (create if missing, update if existing)
- Event detail page shows count of `YES` RSVPs

### Security and Validation

- Request payload validation and sanitization (`express-validator`)
- Mongo ObjectId validation middleware
- Login rate limiting (5 attempts per 2 minutes)
- Protected routes for auth and host authorization

### UX and Error Handling

- Flash messages for success/error states
- 404 error handler for unknown routes
- 500 error handler for server errors

## Routes Overview

### Main Routes

- `GET /` Home page
- `GET /about` About page
- `GET /contact` Contact page

### User Routes

- `GET /users/new` Signup form (guest only)
- `POST /users` Create account
- `GET /users/login` Login form (guest only)
- `POST /users/login` Authenticate user (rate-limited)
- `GET /users/profile` User profile (logged in)
- `GET /users/logout` Logout user

### Event Routes

- `GET /events` List all events
- `GET /events/new` New event form (logged in)
- `POST /events` Create event (logged in, validated, image upload)
- `GET /events/:id` Event detail
- `GET /events/:id/edit` Edit form (host only)
- `PUT /events/:id` Update event (host only)
- `DELETE /events/:id` Delete event (host only)
- `POST /events/rsvp/:id` RSVP to event (logged in)

## Data Models

### User

- `firstName`
- `lastName`
- `email` (unique)
- `password` (hashed before save)

### Event

- `category` (enum)
- `title`
- `host` (User reference)
- `image`
- `details`
- `location`
- `startDate`
- `endDate`

### RSVP

- `user` (User reference)
- `event` (Event reference)
- `status` (`YES | NO | MAYBE`)

## Project Structure

- `app.js` App setup, DB connection, session config, middleware mount, route mount
- `controllers/` Business logic for main, user, and event flows
- `routes/` Route definitions
- `models/` Mongoose schemas
- `middleware/` Auth, validators, upload, and rate limiting
- `views/` EJS templates
- `public/` Static assets (CSS/images)

## Setup and Run

1. Install dependencies:

```bash
npm install
```

2. Configure MongoDB connection:

- Current code uses a hardcoded Mongo URI in `app.js`.
- Recommended: move URI to environment variable (`MONGO_URI`) and load it from code.

### MongoDB Connection String

This project uses a MongoDB Atlas style connection string (`mongodb+srv`) for both:

- Mongoose DB connection
- Session store (`connect-mongo`)

Current location in code:

- `app.js` (`const mongUri = "..."`)
- `app.js` (`store: new MongoStore({ mongoUrl: "..." })`)

Atlas format:

```text
mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
```

Example:

```text
mongodb+srv://myUser:myPass@cluster0.xxxxx.mongodb.net/car_community?retryWrites=true&w=majority
```

Local MongoDB format:

```text
mongodb://127.0.0.1:27017/car_community
```

Important notes:

- If Atlas cluster is paused/deleted, app startup will fail with DNS/connection errors.
- Ensure your Atlas IP access list allows your current machine IP.
- Ensure the DB user credentials in the string are valid.
- If password has special characters (like `@`, `#`, `%`), URL-encode it.

3. Start the app:

```bash
node app.js
```

Optional (development):

```bash
npx nodemon app.js
```

4. Open in browser:

- `http://localhost:3000`

## Notes

- `package.json` currently does not define `start` or `dev` scripts.
- If `npm run dev` fails, run `node app.js` directly.
- RSVP values are strictly validated as uppercase `YES`, `NO`, or `MAYBE`.
