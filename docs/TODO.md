# TODO List

- [ ] **[Suggestion]** `src/renderer/components/PatchNotesModal.css`: Refactor to use CSS modules or scoped styles to avoid global class name collisions. (Reason: Maintainability)
- [ ] **[Suggestion]** `src/main/events/handlers/PatchNoteHandler.ts`: Implement caching for GitHub API responses to prevent rate limiting and improve performance. (Reason: Performance)
- [ ] **[Suggestion]** `src/main/events/handlers/PatchNoteHandler.ts`: Implement **scroll-based loading (pagination)** for patch notes to load more releases as the user scrolls, instead of a fixed limit. (Reason: UX/Performance)
