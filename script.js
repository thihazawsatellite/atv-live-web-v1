
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6alJRVgruWpnsWlagz6HiYjXxzRAJYqM",
  authDomain: "atv-live-mm.firebaseapp.com",
  projectId: "atv-live-mm",
  storageBucket: "atv-live-mm.firebasestorage.app",
  messagingSenderId: "1025513548303",
  appId: "1:1025513548303:web:4ca401320010eba9b9d17a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    const login = document.getElementById('login-screen');
    const main = document.getElementById('main-content');
    if (user) { login.style.display = 'none'; main.style.display = 'block'; loadM3U(); }
    else { login.style.display = 'flex'; main.style.display = 'none'; }
});

window.handleLogin = async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    try { await signInWithEmailAndPassword(auth, e, p); }
    catch (err) { document.getElementById('msg').innerText = "Login Failed!"; }
};

window.handleLogout = () => signOut(auth);

var player = new Clappr.Player({ parentId: "#player", width: '100%', height: '100%' });

async function loadM3U() {
    const res = await fetch('m.m3u');
    const data = await res.text();
    const list = document.getElementById('channel-list');
    list.innerHTML = '';
    data.split('\n').forEach((line, i, arr) => {
        if (line.startsWith('#EXTINF')) {
            const name = line.split(',')[1];
            const url = arr[i+1];
            const div = document.createElement('div');
            div.className = 'channel-item';
            div.innerText = name;
            div.onclick = () => player.configure({ source: url, autoPlay: true });
            list.appendChild(div);
        }
    });
}
