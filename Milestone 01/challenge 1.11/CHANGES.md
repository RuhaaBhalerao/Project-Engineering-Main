# Changes Log

## Variable Renames
| Old Name | New Name | Why |
|----------|----------|-----|
| d | confessionData | The value stores the incoming confession payload. |
| arr | sortedConfessions | The value holds the confession list after sorting. |
| result | confessionList | The value describes the collection being returned. |
| i | confessionId | The value is the parsed confession identifier. |
| stuff | findConfessionsByCategory() result | The value is the category-filtered confession list. |
| handler | confessionIndex | The value stores the matching index in the confession list. |
| res2 | deletedConfession | The value stores the deleted confession record. |

## Function Splits
`handleAll()` was split into:
- `validateConfessionInput()`
- `saveConfession()`
- `formatConfessionResponse()`
- `getAllConfessions()`
- `findConfessionById()`
- `findConfessionsByCategory()`
- `deleteConfessionById()`

Why: the original function mixed validation, lookup, mutation, and response formatting.

## Structure
- Added `routes/` for request mapping.
- Added `controllers/` for request and response handling.
- Added `services/` for confession rules and in-memory data operations.
- Added `.env` and `.env.example` for runtime configuration.