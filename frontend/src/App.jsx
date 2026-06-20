import {
  Route,
  Routes,
} from "react-router";

import DesignWorkspacePage
  from "./pages/DesignWorkspacePage.jsx";

import AppLayout
  from "./components/AppLayout.jsx";
import ChallengeDetailPage
  from "./pages/ChallengeDetailPage.jsx";
import ChallengesPage
  from "./pages/ChallengesPage.jsx";
import DashboardPage
  from "./pages/DashboardPage.jsx";
import LessonPage
  from "./pages/LessonPage.jsx";
import NotFoundPage
  from "./pages/NotFoundPage.jsx";
import TopicLessonsPage
  from "./pages/TopicLessonsPage.jsx";
import TopicsPage
  from "./pages/TopicsPage.jsx";

export default function App() {
  return (
      <Routes>
        <Route element={<AppLayout />}>
          <Route
              index
              element={<DashboardPage />}
          />

          <Route
              path="topics"
              element={<TopicsPage />}
          />

          <Route
              path="topics/:topicSlug"
              element={<TopicLessonsPage />}
          />

          <Route
              path={
                  "topics/:topicSlug/lessons/"
                  + ":lessonSlug"
              }
              element={<LessonPage />}
          />

          <Route
              path="challenges/:challengeSlug/workspace"
              element={<DesignWorkspacePage />}
          />

          <Route
              path="challenges/:challengeSlug"
              element={<ChallengeDetailPage />}
          />

          <Route
              path="challenges"
              element={<ChallengesPage />}
          />

          <Route
              path="challenges/:challengeSlug"
              element={<ChallengeDetailPage />}
          />

          <Route
              path="*"
              element={<NotFoundPage />}
          />
        </Route>
      </Routes>
  );
}