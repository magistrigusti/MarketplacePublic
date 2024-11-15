// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyAMQYGpOBTeY2fOQYnW-pxZggPfsUXb6bs",
    authDomain: "nft-discord-relay.firebaseapp.com",
    projectId: "nft-discord-relay",
    storageBucket: "nft-discord-relay.appspot.com",
    messagingSenderId: "301342258358",
    appId: "1:301342258358:web:b074b4535552ae0e6ee217",
    measurementId: "G-533CCS7B8D"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    if (!payload?.notification) return;
    const { title, body } = payload.notification;
    // Create new browser notification
    new Notification(title, {
        body,
        icon: '/assets/site-logos/logo-transparent.png'
    });
});
