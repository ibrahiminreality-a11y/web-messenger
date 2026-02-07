import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDocs, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
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

let currentUser = null;
let selectedUser = null;
let currentChatId = null;

// REGISTER
window.register = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: email,
    online: true
  });

  alert("User registered successfully!");
};

// LOGIN
window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  currentUser = user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    online: true
  }, { merge: true });

  document.getElementById("welcomeText").innerText = "Welcome, " + user.email;

  loadUsers();
};

// OFFLINE WHEN CLOSE
window.addEventListener("beforeunload", async () => {
  if (currentUser) {
    await setDoc(doc(db, "users", currentUser.uid), {
      online: false
    }, { merge: true });
  }
});

// LOAD USERS (REAL-TIME)
function loadUsers() {

  const userListDiv = document.getElementById("userList");

  onSnapshot(collection(db, "users"), (snapshot) => {

    userListDiv.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const userData = docSnap.data();

      if (currentUser && userData.email !== currentUser.email) {

        const div = document.createElement("div");

        let status = userData.online ? "🟢 Online" : "⚪ Offline";

        div.innerHTML = `
          <div>${userData.email}</div>
          <small>${status}</small>
        `;

        div.classList.add("user-item");

        div.onclick = () => openChat(docSnap.id, userData.email);

        userListDiv.appendChild(div);
      }
    });
  });
}

// OPEN CHAT
function openChat(userId, email) {

  selectedUser = userId;

  document.getElementById("chatHeader").innerText = email;

  currentChatId = currentUser.uid < userId
    ? currentUser.uid + "_" + userId
    : userId + "_" + currentUser.uid;

  loadMessages();
}

// SEND MESSAGE
window.sendMessage = async function () {

  const text = document.getElementById("messageInput").value;

  if (!text || !selectedUser) return;

  await addDoc(
    collection(db, "chats", currentChatId, "messages"),
    {
      text: text,
      sender: currentUser.uid,
      timestamp: new Date()
    }
  );

  document.getElementById("messageInput").value = "";
};

// REAL-TIME MESSAGES
function loadMessages() {

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  const q = query(
    collection(db, "chats", currentChatId, "messages"),
    orderBy("timestamp")
  );

  onSnapshot(q, (snapshot) => {

    messagesDiv.innerHTML = "";

    snapshot.forEach((doc) => {

      const msg = doc.data();
      const div = document.createElement("div");

      div.innerText = msg.text;
      div.classList.add("message");

      if (msg.sender === currentUser.uid) {
        div.classList.add("sent");
      } else {
        div.classList.add("received");
      }

      messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
      }
