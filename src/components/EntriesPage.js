import React from 'react';
import { Typography, Grid, IconButton } from '@material-ui/core';
import '../style.css'
import EntryCard from './EntryCard';
import emptyState from '../assets/emptyState.svg'
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { emailToUsername } from '../services/helperFunctions'

function EntriesPage({ entries, fetchingEntries, email, boundryDocs, totalCount, changingEntries }) {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <div className='appBackground' style={{ minHeight: 'calc(100vh - 64px)', paddingTop: smDown ? 0 : 64 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ widht: '100%', textAlign: 'center' }}>
          <Typography variant={smDown ? "h5" : 'h3'} style={{ color: '#212121', textAlign: 'center', paddingTop: 30, fontWeight: smDown ? 450 : 400 }}>{`Welcome ${emailToUsername(email)}`}</Typography>
          {!entries.length && !fetchingEntries ?
            <div style={{ width: '100%', paddingTop: 100 }}>
              <img alt='empty' src={emptyState} style={{ height: mdDown ? '' : 500, width: smDown ? 250 : '500px' }} />
            </div>
            : null}
        </div>
        {fetchingEntries ?
          <Grid container justify='center' style={{ paddingTop: 20 }}>
            <Grid item xs={12} sm={11} md={10} lg={10} xl={8} style={{ display: 'flex' }}>
              <Grid container justify={smDown ? 'center' : null}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((x) => (
                  <Grid key={x} item xs={11} sm={11} md={6} lg={3} xl={3} style={{ padding: 15 }}>
                    <Skeleton variant='rect' animation='wave' style={{ height: 280, width: '100%', borderRadius: 15, }} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          :
          <Grid container justify='center' style={{ paddingTop: 20, paddingBottom: totalCount <= 8 && smDown ? 100 : 0 }}>
            <Grid item xs={12} sm={11} md={10} lg={8} xl={6} style={{ display: 'flex' }}>
              <Grid container justify={smDown ? 'center' : null}>
                {entries.map((x, i) => (
                  <Grid key={i} item xs={11} sm={11} md={6} lg={3} xl={3} style={{ padding: 15 }}>
                    <Link to={`/entries/${x.id}`} style={{ textDecoration: 'none', width: '100%' }} >
                      <EntryCard object={x} />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>}
        {totalCount <= 8 ? null :
          <div style={{ paddingBottom: smDown ? 60 : 0 }}>
            <IconButton
              disabled={currentPage === 1}
              style={{ margin: 15, textAlign: 'center' }}
              onClick={() => { changingEntries(boundryDocs, 'back'); setCurrentPage(currentPage - 1) }}>
              <ArrowForwardIosIcon fontSize='large' style={{ transform: 'rotate(180deg)' }} />
            </IconButton>
            <IconButton
              disabled={currentPage === Math.ceil(totalCount / 8)}
              style={{ margin: 15, textAlign: 'center' }}
              onClick={() => { changingEntries(boundryDocs, 'next'); setCurrentPage(currentPage + 1) }}>
              <ArrowForwardIosIcon fontSize='large' />
            </IconButton>
          </div>}

      </div>
    </div>
  );
}

export default EntriesPage