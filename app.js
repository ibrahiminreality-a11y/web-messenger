import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCp64RL0VFeHJR8fD5hEWRbUOUqstxzEaA",
  authDomain: "ibrahim-messenger.firebaseapp.com",
  projectId: "ibrahim-messenger",
  storageBucket: "ibrahim-messenger.firebasestorage.app",
  messagingSenderId: "698525259768",
  appId: "1:698525259768:web:43c848a6d990af9359280d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authBox = document.getElementById("authBox");
const welcomeBox = document.getElementById("welcomeBox");
const userInfo = document.getElementById("userInfo");
const errorText = document.getElementById("error");

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    errorText.innerText = "";
  } catch (e) {
    errorText.innerText = "Login Failed ❌";
  }
};

registerBtn.onclick = async () => {
  try {
    if (!name.value) {
      errorText.innerText = "Enter name first";
      return;
    }

    await createUserWithEmailAndPassword(auth, email.value, password.value);
    errorText.innerText = "Registered Successfully 🎉";
  } catch (e) {
    errorText.innerText = "Register Failed ❌";
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    authBox.classList.add("hidden");
    welcomeBox.classList.remove("hidden");
    userInfo.innerText = "Logged in as: " + user.email;
  } else {
    authBox.classList.remove("hidden");
    welcomeBox.classList.add("hidden");
  }
});
