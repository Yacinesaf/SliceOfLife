import React from 'react';
import { Route } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router'
import firebase from 'firebase'
import SignPageWrapper from './components/SignPageWrapper';
import store from './reduxStore/store';
import EntryWrapper from './components/EntryWrapper';
import LandingPage from './components/LandingPage';
import SnackbarComp from './components/SnackbarComp';
import EntriesPageWrapper from './components/EntriesPageWrapper';
import NavPcVersionWrapper from './components/NavPcVersionWrapper';
import AddEntryWrapper from './components/AddEntryWrapper';
import loadingImg from './assets/loading.svg'
import Profile from './components/Profile';
import Contact from './components/Contact';
import Aboutus from './components/Aboutus';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import NavMobile from './components/NavMobile';
import BackButton from './components/BackButton';


function Routes() {

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  let [changedPath, setChangedPath] = React.useState(false);
  let [isLoading, setIsLoading] = React.useState(true);
  let history = useHistory();
  let location = useLocation();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      store.dispatch({ type: 'SET_USER', payload: { id: user.uid, email: user.email } })
      if (['/login', '/signup', '/', '/aboutus'].includes(location.pathname)) {
        history.push('/entries')
      }
    } else {
      if (!['/login', '/signup', '/', '/aboutus'].includes(location.pathname) && !changedPath) {
        history.push('/login')
        setChangedPath(true)
      }

    }
    setIsLoading(false)
  });
  return (
    <div
      className='appBackground'
      style={isLoading ? {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
        : { minHeight: '100vh' }}>
      {isLoading ?
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundImage: `url(${loadingImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            height: 500,
            width: 500,
            backgroundRepeat: 'no-repeat'

          }} /> :
        <div>
          {smDown ? <NavMobile /> : <NavPcVersionWrapper />}
          <BackButton />
          <AddEntryWrapper />
          <SnackbarComp isMobile={smDown} />
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/entries' component={EntriesPageWrapper} />
          <Route exact path='/entries/:id' component={EntryWrapper} />
          <Route exact path='/signup' component={SignPageWrapper} />
          <Route exact path='/login' component={SignPageWrapper} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/aboutus' component={Aboutus} />
        </div>}

    </div>
  );
}
export default Routes;


