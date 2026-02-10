Add client E2E mock, skeleton loaders, register flow and RBAC helpers

Summary

This PR contains changes to implement a client registration/login demo flow, an async axios Authorization interceptor, skeleton loading UI, a small Match demo, and supporting navigator/role helpers and tests.

Key changes (high level):

- Implement async axios interceptor that reads token from AsyncStorage and sets `Authorization: Bearer <token>`.
- Add client `RegisterScreen` with auto-login: persist token, set axios default, call `auth.login()` and navigate to `AppClient`.
- Add `MatchCard` and `MatchList` demo UI, and `Skeleton` components used across screens.
- Integrate `HomeScreen` with `/api/v1/sync` (auto-refresh + pull-to-refresh) and replace loading spinners with skeletons.
- Move role→route mapping to `src/navigation/routeUtils.ts` to decouple from react-navigation (improves testability).
- Add Jest unit/integration-style tests for the axios interceptor, route mapping, and a mocked E2E flow (register → login → home).
- Add/adjust `__mocks__/@react-native-async-storage/async-storage.js` to return Promises for test stability.
- Add CI workflow to run interceptor test.

Files added/modified (not exhaustive):

- backend/hub-server.js
- backend/check_me_with_token.js
- src/services/api.ts
- src/services/__tests__/api.interceptor.test.ts
- src/context/AuthContext.tsx
- src/navigation/AppNavigator.tsx
- src/navigation/routeUtils.ts
- src/screens/LoginScreen.tsx
- src/screens/RegisterScreen.tsx
- src/screens/HomeScreen.tsx
- src/screens/MatchList.tsx
- src/components/MatchCard.tsx
- src/components/Skeleton.tsx
- src/__tests__/e2e.client.flow.test.tsx
- src/navigation/__tests__/appNavigator.test.ts
- __mocks__/@react-native-async-storage/async-storage.js
- .github/workflows/ci-interceptor-test.yml

Guarantees / Non-goals

- CLIENT does not create hierarchy: registration creates users with role `CLIENT` only and cannot escalate privileges.
- RBAC preserved: admin-only routes remain protected by `authMiddleware` + `roleMiddleware` on the backend.
- E2E in this PR is a Jest mocked flow (fast, hermetic). Device-level E2E (Detox) is not included here.

Testing

- Unit tests for the interceptor and navigator utils are included and passing locally.
- A mocked Jest "E2E" test covers the client registration → token persistence → navigation flow.

Notes

- There is a discovered storage key mismatch between places that read `TOKEN` and places that persist `@saasportes:token`. I did not silently change the app behaviour in this PR; recommend unifying storage key in a follow-up if desired.

Reviewers: please focus on the following areas:
- Auth flow correctness: token persistence, `setAuthToken` usage, and `AuthContext` interactions.
- RBAC: ensure no accidental privilege escalation paths.
- Tests: confirm mocks are appropriate and CI workflow triggers as expected.

