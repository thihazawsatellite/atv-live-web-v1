// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6alJRVgruWpnsWlagz6HiYjXxzRAJYqM",
    authDomain: "atv-live-mm.firebaseapp.com",
    projectId: "atv-live-mm",
    storageBucket: "atv-live-mm.firebasestorage.app",
    messagingSenderId: "1025513548303",
    appId: "1:1025513548303:web:4ca401320010eba9b9d17a",
    databaseURL: "https://atv-live-mm-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Login Function
function login() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    if(!e || !p) return alert("Email နှင့် Password ဖြည့်ပါ");
    auth.signInWithEmailAndPassword(e, p).catch(err => alert("Login Error: " + err.message));
}

// Register Function
function register() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    if(p.length < 6) return alert("Password အနည်းဆုံး ၆ လုံး ရှိရမည်");
    auth.createUserWithEmailAndPassword(e, p).then(() => alert("အကောင့်ဖွင့်ပြီးပါပြီ")).catch(err => alert(err.message));
}

// Auth State Change
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('userInfoArea').innerHTML = `
            <div style="font-size:11px; color:#aaa;">${user.email}</div>
            <button class="logout-btn" onclick="auth.signOut()">Logout</button>
        `;
        loadChannels();
    } else {
        document.getElementById('loginArea').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('userInfoArea').innerHTML = "";
    }
});

// Load Channels from Firebase 'iptv' node
function loadChannels() {
    database.ref('iptv').on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('channelList');
        list.innerHTML = "";
        
        if (data) {
            const channels = Array.isArray(data) ? data : Object.values(data);
            channels.forEach(ch => {
                if(ch && ch.name && ch.url) {
                    const btn = document.createElement('button');
                    btn.className = "channel-btn";
                    btn.innerHTML = `<span>${ch.name}</span>`;
                    btn.onclick = () => playChannel(ch.url);
                    list.appendChild(btn);
                }
            });
        } else {
            list.innerHTML = "<p>ဒေတာ မရှိသေးပါ။</p>";
        }
    });
}

// Play m3u8 Video
function playChannel(url) {
    const video = document.getElementById('videoPlayer');
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
}
