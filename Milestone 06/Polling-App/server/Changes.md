Investigation notes (before fixes)

- Auth middleware (`middleware/auth.js`) returns 500 on token verification errors. Expired tokens cause a generic 500 response which the frontend may interpret as server error instead of session expiry.
- Voting logic (`routes/poll.js`) compares `votedUserIds.find(id => id === req.user.email)` while `votedUserIds` stores numeric user ids. This comparison always fails so duplicate voting is allowed.
- Frontend (to be created) will not have an Axios 401 interceptor and will continue polling after token expiry.
- Polling interval will not be cleared on session end (frontend issue).
