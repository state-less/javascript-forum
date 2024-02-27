import { Route } from 'react-router';
import { ForumPage, PostsPage } from '@state-less/leap-frontend';
import HomeIcon from '@mui/icons-material/Home';

import {
  FORUM_BASE_PATH,
  FORUM_KEY,
  FORUM_QA_GH,
  FORUM_RULES_GH,
} from './lib/config';

export const navigation = [['/', 'Home', '', 'Forum', HomeIcon]] as any;

export const routes = [
  // <Route path="/" Component={MainPage} />,
  <Route
    path="/"
    Component={() => {
      return (
        <ForumPage
          forumKey={FORUM_KEY}
          basePath={FORUM_BASE_PATH}
          ghSrc={{
            rules: FORUM_RULES_GH,
            qa: FORUM_QA_GH,
          }}
        />
      );
    }}
  />,
  <Route
    path="/:post"
    Component={() => {
      return <PostsPage basePath={FORUM_BASE_PATH} forumKey={FORUM_KEY} />;
    }}
  />,
];
