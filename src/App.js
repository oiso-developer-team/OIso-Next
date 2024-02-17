import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';

export const ThemeContext = React.createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? webDarkTheme : webLightTheme);
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const changeHandler = () => setTheme(mediaQuery.matches ? webDarkTheme : webLightTheme);
    mediaQuery.addEventListener('change', changeHandler);
    // Cleanup function
    return () => mediaQuery.removeEventListener('change', changeHandler);
  }, []);
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

const App = () => {
  return (
    <ThemeProvider>
        <Router>
          <div>
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/search">
                <SearchPage />
              </Route>
            </Switch>
          </div>
        </Router>
    </ThemeProvider>
  );
};

export default App;
