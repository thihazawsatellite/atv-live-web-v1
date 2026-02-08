import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB6alJRVgruWpnsWlagz6HiYjXxzRAJYqM",
  authDomain: "atv-live-mm.firebaseapp.com",
  projectId: "atv-live-mm",
  storageBucket: "atv-live-mm.firebasestorage.app",
  messagingSenderId: "1025513548303",
  appId: "1:1025513548303:web:4ca401320010eba9b9d17a",
  databaseURL: "https://atv-live-mm-default-rtdb.firebaseio.com" // သင့် Database URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Login စစ်ဆေးခြင်း
onAuthStateChanged(auth, (user) => {
    const login = document.getElementById('login-screen');
    const main = document.getElementById('main-content');
    if (user) {
        login.style.display = 'none';
        main.style.display = 'block';
        loadChannels(); // Database မှ Channel များခေါ်ယူရန်
    } else {
        login.style.display = 'flex';
        main.style.display = 'none';
    }
});

// Database မှ Channel များခေါ်ယူပြသပေးမည့် Function
function loadChannels() {
    const channelRef = ref(db, 'channels');
    onValue(channelRef, (snapshot) => {
        const data = snapshot.val();
        const listContainer = document.getElementById('channel-list');
        listContainer.innerHTML = '';
        
        for (let id in data) {
            const item = document.createElement('div');
            item.className = 'channel-item';
            item.innerHTML = `<span>${data[id].name}</span>`;
            item.onclick = () => {
                player.configure({ source: data[id].url, autoPlay: true });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            listContainer.appendChild(item);
        }
    });
}

window.handleLogin = async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    try { await signInWithEmailAndPassword(auth, e, p); }
    catch (err) { document.getElementById('msg').innerText = "Email သို့မဟုတ် Password မှားနေပါသည်။"; }
};

window.handleLogout = () => signOut(auth);

var player = new Clappr.Player({ parentId: "#player", width: '100%', height: '100%' });
