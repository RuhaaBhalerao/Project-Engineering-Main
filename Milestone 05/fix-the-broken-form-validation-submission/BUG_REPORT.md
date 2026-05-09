## Bug 1: Empty submission allowed
Root cause: validate() always returns true and is ignored in handleSubmit

## Bug 2: Double submission
Root cause: loading state not set before API call

## Bug 3: Form not resetting
Root cause: setForm not called after success

## Bug 4: Server error not shown
Root cause: catch block is empty

## Bug 5: No field-level errors
Root cause: errors not rendered in JSX

## Bug 6: Invalid steps accepted
Root cause: no validation for stepsCount
final submitted
Final PR for TrackFlow form fix
