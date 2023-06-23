// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCB366295G2EX3eeFoJQ2actxpKtjtVZTQ',
  authDomain: 'fir-dev-c9330.firebaseapp.com',
  projectId: 'fir-dev-c9330',
  storageBucket: 'fir-dev-c9330.appspot.com',
  messagingSenderId: '840349477989',
  appId: '1:840349477989:web:3c40597305465347e9aa8c',
  measurementId: 'G-2T0YPYFL3Z',
};

// Initialize Firebase
if (!getApps()?.length) {
  initializeApp(firebaseConfig);
}

export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions();
export const db = getFirestore();
