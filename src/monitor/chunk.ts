import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/performance';
import * as sentry from '@sentry/browser';

firebase.initializeApp({
   projectId: 'image-drop',
   apiKey: 'AIzaSyDL_JhEwKzdeIT_FdFhzPqyGD_57Aw2wzU',
   appId: '1:340426506959:web:f2cf37d5cdc2f479a36dba',
   measurementId: 'G-NB2LLVENJE'
});

sentry.init({
   dsn: 'https://beafc8be05034d0485b513b01526ed3d@o379971.ingest.sentry.io/5205341'
});

export const analytics = firebase.analytics();
export const performance = firebase.performance();
export { sentry };
