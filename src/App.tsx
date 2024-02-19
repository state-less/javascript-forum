import './App.css';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useLocalStorage } from '@state-less/react-client';
import { Helmet } from 'react-helmet';

import client, { localClient } from './lib/client';
import { StateProvider } from './provider/StateProvider';
import { USE_PROD_CLIENT } from './lib/config';
import { ThemeProvider } from './provider/ThemeProvider';
import { Layout } from './container/Layout';

function App() {
  const [cookieConsent] = useLocalStorage('cookie-consent', null);
  return (
    <>
      {cookieConsent === true && (
        <Helmet>
          <script src="https://www.googletagmanager.com/gtag/js?id=G-C3F4656WLD"></script>
          <script id="gtm-script" src="/gtag-1.js"></script>
          <script
            id="test"
            type="application/javascript"
            src="/gtag-2.js"
          ></script>
        </Helmet>
      )}
      <ApolloProvider
        client={
          import.meta.env.MODE === 'production'
            ? client
            : USE_PROD_CLIENT
              ? client
              : localClient
        }
      >
        <AuthProvider>
          <StateProvider>
            <ThemeProvider>
              <Router>
                <Layout />
              </Router>
            </ThemeProvider>
          </StateProvider>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
