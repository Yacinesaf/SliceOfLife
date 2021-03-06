import axios from 'axios'
import firebaseApp from '../firebase'
import { formatDate } from './helperFunctions'
import firebase from 'firebase/app'
require('firebase/auth')


function getRandomImage() {
  return axios.get("https://api.unsplash.com/photos/random?client_id=uxmW_PR6Zn3N6vc5Zsc2pQJVOwzezAXoPBSOi1eXa4A")
  .then(res => res.data.urls.regular)
}
function getEntries() {
  var user = firebase.auth().currentUser;
  let db = firebase.firestore(firebaseApp);
  return db.collection('entries').orderBy('date', 'desc').where('userId', '==', user.uid).limit(8)
    .get()
    .then(function (querySnapshot) {
      let entries = querySnapshot.docs.map(doc => {
        let obj = doc.data();
        obj.date = formatDate(obj.date);
        obj['id'] = doc.id
        return obj
      })
      return {
        entries,
        docs: {
          start: querySnapshot.docs[0],
          end: querySnapshot.docs[querySnapshot.docs.length - 1]
        }
      }
    })
}

function switchEntries(docs, direction) {
  var user = firebase.auth().currentUser;
  let db = firebase.firestore(firebaseApp);
  var lastVisible = direction !== 'next' ? docs.start : docs.end;
  if (direction === 'next') {
    return db.collection("entries")
      .orderBy("date", 'desc')
      .startAfter(lastVisible)
      .where('userId', '==', user.uid)
      .limit(8)
      .get()
      .then(function (querySnapshot) {
        let entries = querySnapshot.docs.map(doc => {
          let obj = doc.data();
          obj.date = formatDate(obj.date);
          obj['id'] = doc.id
          return obj
        })
        return {
          entries,
          docs: {
            start: querySnapshot.docs[0],
            end: querySnapshot.docs[querySnapshot.docs.length - 1]
          }
        }
      })

  } else {
    return db.collection('entries')
      .orderBy("date", 'asc')
      .startAfter(lastVisible)
      .where('userId', '==', user.uid)
      .limit(8)
      .get()
      .then(function (querySnapshot) {
        let entries = querySnapshot.docs.map(doc => {
          let obj = doc.data();
          obj.date = formatDate(obj.date);
          obj['id'] = doc.id
          return obj
        })
        return {
          entries: entries.reverse(),
          docs: {
            end: querySnapshot.docs[0],
            start: querySnapshot.docs[querySnapshot.docs.length - 1]
          }
        }
      })
  }
}

function getEntriesCount() {
  var user = firebase.auth().currentUser;
  let db = firebase.firestore(firebaseApp);
  return db.collection('entries')
    .where('userId', '==', user.uid)
    .get()
    .then(function (querySnapshot) {
      return querySnapshot.docs.length
    })
}

function getEntry(id) {
  var user = firebase.auth().currentUser;
  let db = firebase.firestore(firebaseApp);
  var docRef = db.collection("entries").doc(id);

  return docRef.get().then(function (doc) {
    let obj = doc.data();
    obj.date = formatDate(obj.date);
    obj['id'] = doc.id
    return obj
  })
}

function createEntry(obj) {
  let db = firebase.firestore(firebaseApp);
  return getRandomImage().then(res => {
    obj['img'] = res;
    let backendFormat = { ...obj, date: firebase.firestore.Timestamp.fromDate(new Date()) }
    return db.collection("entries").add(backendFormat).then(function (doc) {
      return { ...obj, id: doc.id }
    })
  })
}

function createUser(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res => {
      return {
        id: res.user.uid,
        email: res.user.email
      }
    })
}

function login(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
      return {
        id: res.user.uid,
        email: res.user.email
      }
    })
}

function signOut() {
  return firebase.auth().signOut()
}

function getParagraph() {
  return fetch("https://mashape-community-skate-ipsum.p.rapidapi.com/1/0/JSON", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "mashape-community-skate-ipsum.p.rapidapi.com",
      "x-rapidapi-key": "33bfbd583amshc3ab9d939cbd064p1b78dbjsnb9b3cbe85197"
    }
  })
    .then(response => {
      return response.json().then(res => {
        return res
      })
    })
}

export {
  getEntry,
  getRandomImage,
  getEntries,
  createEntry,
  getEntriesCount,
  switchEntries,
  createUser,
  login,
  signOut,
  getParagraph
}
