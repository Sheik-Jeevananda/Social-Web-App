PHASE 1 — Setup

Create root folder social-media-app
Inside it, create two folders — server and client
In server, run npm init -y
In client, run npx create-react-app client
Install backend packages — express, mongoose, dotenv, bcryptjs, jsonwebtoken, cors, multer, socket.io
Install frontend packages — axios, react-router-dom, @reduxjs/toolkit, react-redux, socket.io-client, react-icons, react-hot-toast
Create .env file in server with MONGO_URI and JWT_SECRET
Setup basic server.js with Express, MongoDB connection, and Socket.io

PHASE 2 — Backend Auth

Create User model with fields — username, email, password, avatar, bio, followers, following
Create authController.js with register and login functions
Hash password using bcryptjs on register
Generate JWT token on login and register
Create authMiddleware.js to protect routes by verifying JWT
Create authRoutes.js and connect to server

PHASE 3 — Backend Posts

Create Post model with fields — author, content, mediaUrl, likes, comments
Create postController.js with createPost, getFeed, likePost functions
Feed query fetches posts from users you follow, sorted by latest
Like toggle — add userId if not liked, remove if already liked
Create postRoutes.js and connect to server

PHASE 4 — Backend Comments & Follow

Create Comment model with fields — post, author, text, likes
Create addComment function in commentController.js
Create userController.js with followUser function
Follow toggle — push/pull userId from followers and following arrays
Create Notification model with fields — recipient, sender, type, post, read
Trigger notification on like, comment, and follow actions

PHASE 5 — Backend Messages

Create Message model with fields — sender, receiver, text, seen
Create messageController.js with sendMessage and getConversation functions
Create messageRoutes.js and connect to server

PHASE 6 — No Cloudinary Setup

This app no longer uses Cloudinary or server-side image upload middleware.

PHASE 7 — Socket.io (Real-Time)

In server.js, maintain an online users map — userId to socketId
On connection, save user's socketId
On disconnect, remove user from map
Emit notification event to recipient's socketId when someone likes, comments, or follows
Emit message event to receiver's socketId for real-time chat

PHASE 8 — Frontend Auth

Setup React Router with routes for login, register, feed, profile, messages
Create Redux authSlice with login, logout, and updateUser actions
Store JWT token in localStorage
Create Login page with email and password form
Create Register page with username, email, and password form
Create PrivateRoute component to protect pages from unauthenticated users
Create axios instance with base URL and auto-attach JWT token in headers

PHASE 9 — Frontend Feed & Posts

Create Feed page that fetches posts from /api/posts/feed
Create PostCard component showing avatar, username, likes count, comments count
Add like button that toggles and calls like API
Create CreatePost component with text input only
On submit, send post data to backend and refresh feed

PHASE 10 — Frontend Profile

Create Profile page showing user avatar, bio, followers count, following count
Show all posts by that user in a grid layout
Add Follow / Unfollow button that calls follow API
Create Edit Profile modal to update bio and username

PHASE 11 — Frontend Comments & Notifications

Create Comment section inside PostCard
Show comments list with author name and text
Add comment input at the bottom
Create Notifications page listing all notifications with type and sender info
Mark notifications as read when page is opened

PHASE 12 — Frontend Messages

Create Messages page with left panel showing conversation list
Right panel shows chat with selected user
Connect to Socket.io on app load
Listen for incoming message events and update chat in real time
Send message on Enter key or send button click

PHASE 13 — Explore & Search

Create Explore page showing trending or recent posts from all users
Add search bar to search users by username
Show search results as a dropdown with avatar and username
Clicking a result navigates to that user's profile

PHASE 14 — Polish

Add loading skeletons for feed and profile pages
Add infinite scroll on feed using Intersection Observer
Make all pages fully responsive for mobile
Add toast notifications for actions like post created, followed, error
Add empty state UI when feed or messages are empty

PHASE 15 — Deployment

Push code to GitHub
Deploy backend on Render or Railway — add all env variables
Deploy frontend on Vercel — set backend URL as environment variable
Create MongoDB Atlas cluster and whitelist all IPs
Create Cloudinary account and add credentials to backend env
Test all features on live URL
