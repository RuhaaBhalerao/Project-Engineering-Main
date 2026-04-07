# Pre-Refactor Audit

Source reviewed: [app.js](app.js)

## Structure
- [app.js:6-96](app.js#L6) packs validation, persistence, filtering, formatting, and response handling into one `handleAll()` function, so the file violates single responsibility and is hard to test in isolation.
- [app.js:97-116](app.js#L97) defines all routes directly in the entry file, which keeps routing, request handling, and app bootstrap tightly coupled.
- [app.js:4-5](app.js#L4) stores all data in process memory, so data is lost on restart and there is no persistence layer abstraction.

## Naming
- [app.js:7](app.js#L7) uses `d` for request body, which does not explain what it stores.
- [app.js:8](app.js#L8) uses `r` for route params, which is too vague.
- [app.js:41](app.js#L41) uses `arr` for sorted confessions, which hides intent.
- [app.js:42-45](app.js#L42) uses `result` without naming the shape or purpose clearly.
- [app.js:49](app.js#L49) uses `i` for parsed ID, which is ambiguous.
- [app.js:65](app.js#L65) uses `stuff` for filtered category results, which is not descriptive.
- [app.js:81-85](app.js#L81) uses `handler` for a found index and `res2` for deleted rows, both of which are unclear.

## Duplication and Magic Values
- [app.js:16, 63](app.js#L16) repeats the confession category list in two places, which risks drift if categories change.
- [app.js:76](app.js#L76) hardcodes the delete token directly in code.
- [app.js:110](app.js#L110) hardcodes the server port directly in code.

## Validation and Error Handling
- [app.js:10-38](app.js#L10) nests validation deeply instead of isolating it into a dedicated function, which makes the flow difficult to follow.
- [app.js:13-15](app.js#L13) validates `text` with multiple nested checks instead of a single clear guard sequence.
- [app.js:17](app.js#L17) mixes category validation with creation logic instead of centralizing business rules.
- [app.js:51-57](app.js#L51) returns a 500 when `info.text` is falsy, which suggests the data model assumes a field that should always exist but never enforces that invariant.
- [app.js:102-106](app.js#L102) adds an extra `if (req.params.cat)` check even though the route already requires `:cat`.

## Data Flow
- [app.js:18-26](app.js#L18) constructs the confession object inline instead of through a focused create/save function.
- [app.js:41-47](app.js#L41) sorts and formats response data inline instead of delegating to a service helper.
- [app.js:65-71](app.js#L65) filters categories inline with an anonymous function that is harder to reuse or test.
- [app.js:83-85](app.js#L83) deletes data inline and immediately formats the response, which mixes state mutation with response shaping.

## Maintainability
- [app.js:25, 46, 53, 84, 111](app.js#L25) uses ad hoc console logging with inconsistent message style, which makes diagnostics noisy and inconsistent.
- [app.js:114-116](app.js#L114) contains dead or placeholder logic after the server starts, which does not contribute to request handling.
- [app.js:1-116](app.js#L1) has no separation into routes, controllers, or services, so the codebase is not organized for incremental refactoring.

## Missing Project Files
- There is no [CHANGES.md](CHANGES.md) yet to record refactor steps.
- There is no `.env` or `.env.example`, so runtime configuration is still embedded in code.
- There are no tests or fixtures in this challenge folder, so behavior changes are not automatically guarded.