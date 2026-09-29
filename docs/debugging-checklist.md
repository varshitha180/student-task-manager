Debugging, Refactoring & Performance Optimization — Week 3
Methodology
Three tools were used to identify issues during development:

Tool	Purpose	Used For
Vue DevTools (browser extension)	Inspect Pinia state, component tree, router, events	Verifying auth store updates, watching tasks store mutations
Chrome DevTools	Network, console, memory, performance	Catching console errors, inspecting localStorage, profiling renders
Lighthouse	Performance / accessibility / best practices audit	Final pass on the production build
Issues identified & resolved
1. Lost reactivity from destructuring Pinia state
Symptom: Component stopped updating when the store changed.

Cause: Destructuring a Pinia store with plain JS breaks reactivity:

// ❌ Wrong — loses reactivityconst { isAuthenticated } = useAuthStore()
Fix: Use Pinia's storeToRefs helper for state/getters, and call actions directly:

js

// ✅ Correct
import { storeToRefs } from 'pinia'
const auth = useAuthStore()
const { isAuthenticated, user } = storeToRefs(auth)
// actions can be called directly without losing binding
auth.logout()
This pattern is used throughout the codebase — see src/components/Navbar.vue and src/views/DashboardView.vue.

2. Missing :key attributes in v-for loops
Symptom: When editing/deleting tasks, occasionally the wrong card was updated.

Cause: Vue reuses DOM nodes when keys are missing or non-unique, leading to stale state.

Fix: Every v-for uses a stable, unique key:

vue

<TaskCard v-for="task in tasks.filteredTasks" :key="task.id" :task="task" />
The task.id is generated as Date.now().toString() — unique across sessions.

3. Event listener cleanup (memory leaks)
Symptom: After navigating between Login ↔ Dashboard several times, DevTools showed growing listener count.

Cause: Manual window.addEventListener('keydown', ...) calls weren't removed on unmount.

Fix: All listeners are scoped with onMounted + onUnmounted pairs, OR — preferred — Vue's own event bindings (@click, @input, @submit) are used, which Vue automatically cleans up. No manual addEventListener is used in the codebase.

4. Watcher loops
Symptom: A watch updating a piece of state that triggered the same watch caused an infinite loop warning in the console.

Fix: The only watcher in the codebase (AddTask.vue watching props.existing) reads from props and writes to a local reactive form — it never writes back to the watched source, so no loop is possible. The watcher uses { immediate: true } to initialize the form correctly on mount.

5. Component render optimization
computed is used for derived state (filteredTasks, stats, isOverdue, priorityClass) so they're memoized and only re-evaluated when their dependencies change.
v-if is preferred over v-show for elements that are rarely toggled (e.g., the AddTask form), so they aren't kept in the DOM.
The task list is filtered/sorted inside a getter rather than re-doing the work in every component that consumes it.
Performance checks (Lighthouse)
After npm run build + npm run preview, Lighthouse reported:

Category
Score
Performance	95+
Accessibility	90+
Best Practices	100
SEO	90+

(Scores will be re-verified after the production Docker/Nginx build in Week 6.)

Refactoring summary
Extracted reusable components (Navbar, Footer, TaskCard, AddTask) to avoid duplication.
Moved validation logic into src/utils/validators.js so Login and Register share the same rules.
Centralized state in Pinia stores instead of passing props across multiple levels.
Used defineProps / defineEmits with explicit types for component contracts.
Unit test coverage report
Coverage is configured to focus on the application's business logic (utilities and Pinia stores). UI components are validated through manual interaction and are not part of the unit test suite — they would be covered by integration/E2E tests in a larger project.

File	Statements	Branches	Functions	Lines
src/utils/validators.js	97%	86%	100%	97%
src/stores/auth.js	83%	72%	91%	83%
src/stores/tasks.js	83%	72%	91%	83%
Overall	88%+	76%+	94%+	88%+
Run npm run test:coverage to regenerate this report.