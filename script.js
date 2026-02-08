// ၁။ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6alJRVgruWpnsWlagz6HiYjXxzRAJYqM",
  authDomain: "atv-live-mm.firebaseapp.com",
  projectId: "atv-live-mm",
  storageBucket: "atv-live-mm.firebasestorage.app",
  messagingSenderId: "1025513548303",
  appId: "1:1025513548303:web:4ca401320010eba9b9d17a",
  databaseURL: "https://atv-live-mm-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// ၂။ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ၃။ Video Player Function (HLS Support အပါအဝင်)
function playChannel(url) {
  const video = document.getElementById('videoPlayer');
  
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  } 
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', function() {
      video.play();
    });
  }
}

// ၄။ Database ထဲက လိုင်းများကို ဆွဲထုတ်ပြီး List ပြုလုပ်ခြင်း
const channelListDiv = document.getElementById('channelList');

database.ref('channels').on('value', (snapshot) => {
  const data = snapshot.val();
  channelListDiv.innerHTML = ""; // List ကို ရှင်းထုတ်ခြင်း

  for (let id in data) {
    const channel = data[id];
    
    // ခလုတ်ပြုလုပ်ခြင်း
    const btn = document.createElement('button');
    btn.className = "channel-btn";
    btn.innerText = channel.name;
    
    // နှိပ်လိုက်ရင် Video ပွင့်စေခြင်း
    btn.onclick = () => {
      playChannel(channel.url);
      window.scrollTo(0, 0); // Video ရှိရာ အပေါ်ဆုံးသို့ ပြန်သွားရန်
    };
    
    channelListDiv.appendChild(btn);
  }
});
