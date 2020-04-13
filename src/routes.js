import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import SignPageWrapper from './components/SignPageWrapper';
import { Provider } from 'react-redux'
import store from './reduxStore/store';
import EntryWrapper from './components/EntryWrapper';
import LandingPage from './components/LandingPage';
import SnackbarComp from './components/SnackbarComp';
import EntriesPageWrapper from './components/EntriesPageWrapper';
import NavPcVersionWrapper from './components/NavPcVersionWrapper';
import AddEntryWrapper from './components/AddEntryWrapper';


const createRoutes = () => (
  <Provider store={store}>
    <BrowserRouter>
      <NavPcVersionWrapper />
      <AddEntryWrapper />
      <SnackbarComp />
      <Route exact path='/' component={LandingPage} />
      <Route exact path='/entries' component={EntriesPageWrapper} />
      <Route exact path='/entries/:id' component={EntryWrapper} />
      <Route exact path='/signup' component={SignPageWrapper} />
      <Route exact path='/login' component={SignPageWrapper} />
    </BrowserRouter>
  </Provider>
);
export default createRoutes;