---
paths:
  - 'app/Http/Requests/**'
---

# Requests

## One Form Request per resource, not per action
Name Form Requests after the resource, not the controller action: `BatchRequest`, `CourseRequest`, `StudentRequest` — reused for both `store()` and `update()` when the validation rules are the same for both. Only split into separate classes (e.g. `AttendanceUpdateRequest`, `ProfileUpdateRequest` + `ProfileDestroyRequest`) when a controller already established that per-action naming before, or when store/update rules genuinely diverge (e.g. a unique rule needing `->ignore($id)` on update only) — in that case branch inside a single `rules()` via `$this->isMethod(...)` before reaching for two classes. Don't default to Store/Update suffixes.
