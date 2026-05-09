module.exports = {
  poll: {
    question: 'Which color?',
    options: [
      { id: 1, label: 'Red', votes: 0 },
      { id: 2, label: 'Green', votes: 0 },
      { id: 3, label: 'Blue', votes: 0 }
    ],
    // store voter identifiers as numbers (but buggy code will compare to email string)
    votedUserIds: []
  },
  users: []
}
