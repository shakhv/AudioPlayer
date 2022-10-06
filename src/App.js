import './App.css';
import React  from 'react';
import { Provider} from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes
} from "react-router-dom";
import { store } from './store/store';

import { StartPage } from './pages/StartPage';
import { LfConnect } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';

import Player from './pages/Player';

store.subscribe(() => console.log(store.getState()));

function App() {
  return (
   
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<StartPage />} exact/>
            <Route path="/LoginPage" element={<LfConnect />} exact/>
            <Route path="/RegistrationPage" element={<RegistrationPage />} exact/>
            <Route path="/Player/*" element={<Player />} exact/>
          </Routes>
        </Router>
      </Provider>
  
  );
}

export default App;



// "@dnd-kit/core": "^6.0.5",
// "@dnd-kit/sortable": "^7.0.1",
// "@emotion/react": "^11.10.4",
// "@emotion/styled": "^11.10.4",
// "@fortawesome/fontawesome-svg-core": "^6.2.0",
// "@fortawesome/free-regular-svg-icons": "^6.2.0",
// "@fortawesome/free-solid-svg-icons": "^6.2.0",
// "@fortawesome/react-fontawesome": "^0.2.0",
// "@material-ui/icons": "^4.11.3",
// "@mui/icons-material": "^5.10.3",
// "@mui/joy": "^5.0.0-alpha.44",
// "@mui/material": "^5.10.4",
// "@mui/styled-engine-sc": "^5.10.3",
// "@nextui-org/react": "^1.0.0-beta.10",
// "@testing-library/jest-dom": "^5.16.5",
// "@testing-library/react": "^13.4.0",
// "@testing-library/user-event": "^13.5.0",
// "array-move": "^4.0.0",
// "dom": "^0.0.3",
// "react": "^18.2.0",
// "react-dom": "^18.2.0",
// "react-dropzone": "^14.2.2",
// "react-redux": "^8.0.2",
// "react-router": "^6.3.0",
// "react-router-dom": "^6.3.0",
// "react-scripts": "5.0.1",
// "redux-thunk": "^2.4.1",
// "styled-components": "^5.3.5",