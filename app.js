import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSYSa_XqM2fE1gd4sasZu6mn8roO_6T3I",
  authDomain: "web-messenger-bb63f.firebaseapp.com",
  projectId: "web-messenger-bb63f",
  storageBucket: "web-messenger-bb63f.firebasestorage.app",
  messagingSenderId: "911277332941",
  appId: "1:911277332941:web:140ef758adf9c0f3684c84",
  measurementId: "G-HH8F9JFK47"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");
const authSection = document.getElementById("authSection");
const chatInputArea = document.getElementById("chatInputArea");

let currentUser = null;

registerBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("Registration Successful");
  } catch (error) {
    alert(error.message);
  }
};

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("Login Successful");
  } catch (error) {
    alert(error.message);
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    authSection.style.display = "none";
    logoutBtn.style.display = "block";
    messagesDiv.style.display = "block";
    chatInputArea.style.display = "flex";
    loadMessages();
  } else {
    currentUser = null;
    authSection.style.display = "flex";
    logoutBtn.style.display = "none";
    messagesDiv.style.display = "none";
    chatInputArea.style.display = "none";
    messagesDiv.innerHTML = "";
  }
});

sendBtn.onclick = async () => {
  if (!messageInput.value.trim()) return;

  await addDoc(collection(db, "messages"), {
    text: messageInput.value,
    uid: currentUser.uid,
    email: currentUser.email,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
};

function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("createdAt"));

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const msg = document.createElement("div");

      msg.style.padding = "10px";
      msg.style.margin = "5px";
      msg.style.borderRadius = "12px";
      msg.style.maxWidth = "70%";
      msg.style.wordWrap = "break-word";

      if (data.uid === currentUser.uid) {
        msg.style.background = "#dcf8c6";
        msg.style.marginLeft = "auto";
      } else {
        msg.style.background = "#fff";
      }

      msg.innerHTML = `<strong>${data.email}</strong><br>${data.text}`;

      messagesDiv.appendChild(msg);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
