- Original file had all logic in one place
- Extracted into components for modularity

Components:
- DashboardHeader -> header UI
- StatsRow -> shows stats
- StatCard -> reusable stat display
- AddTaskInput -> handles task input
- TaskFilterBar -> filter logic
- TaskList -> renders list
- TaskItem -> reusable task row

Why shared:
- StatCard and TaskItem reusable across app
