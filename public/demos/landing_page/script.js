// --- GLOBÁLNÍ PROMĚNNÉ ---
let isEnglish = false;
const videoURL = "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1";
const hueSlider = document.getElementById('hueSlider');
const root = document.documentElement;

// DOM ELEMENTS
const mainCard = document.getElementById('mainCard');
const contactModal = document.getElementById('contactModal');
const qrModal = document.getElementById('qrModal');
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('youtubeFrame');

// --- HODINY ---
function updateClock() {
    const now = new Date();
    const locale = isEnglish ? 'en-US' : 'cs-CZ';
    
    const timeOpts = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: isEnglish 
    };
    
    const dateOpts = isEnglish 
        ? { weekday: 'short', month: 'short', day: 'numeric' } 
        : { weekday: 'short', day: 'numeric', month: 'numeric' };

    document.getElementById('clock').textContent = now.toLocaleTimeString(locale, timeOpts);
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString(locale, dateOpts);
}

setInterval(updateClock, 1000);
updateClock();

// --- OVLÁDÁNÍ OKEN ---
function openVideo() {
    videoFrame.src = videoURL;
    videoModal.classList.add('active');
    mainCard.classList.add('hidden');
}

function openContact() { 
    contactModal.classList.add('active'); 
    mainCard.classList.add('hidden'); 
}

function openQR() { 
    qrModal.classList.add('active'); 
    mainCard.classList.add('hidden'); 
}

function closeAllModals() { 
    contactModal.classList.remove('active'); 
    qrModal.classList.remove('active'); 
    videoModal.classList.remove('active');
    mainCard.classList.remove('hidden');
    videoFrame.src = ""; // Stop videa
}

// --- TOASTY ---
function showToast(message) {
    const toastEl = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => { toastEl.classList.remove('show'); }, 3000);
}

function submitForm(e) {
    e.preventDefault();
    const msg = isEnglish ? "Message sent!" : "Zpráva odeslána!";
    showToast(msg);
    closeAllModals();
}

function copyToClipboard(type) {
    let msg = "";
    if (isEnglish) {
        msg = type === 'email' ? 'Email copied!' : 'Link copied!';
    } else {
        msg = type === 'email' ? 'Email zkopírován!' : 'Odkaz zkopírován!';
    }
    showToast(msg);
}

function downloadVCard() {
    const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:David Kovář\nEMAIL:david@email.cz\nEND:VCARD`;
    const blob = new Blob([vcardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const newLink = document.createElement('a');
    newLink.download = "kontakt.vcf";
    newLink.href = url;
    newLink.click();
    
    const msg = isEnglish ? "Contact saved!" : "Kontakt stažen!";
    showToast(msg);
}

// --- BARVY ---
hueSlider.addEventListener('input', (e) => root.style.setProperty('--hue', e.target.value));

// --- TYPEWRITER ---
const roles = ["Marketing Specialist", "PPC Expert", "Growth Hacker"];
let count = 0, index = 0, currentText = "", letter = "";

(function type() {
    if (count === roles.length) count = 0;
    currentText = roles[count];
    letter = currentText.slice(0, ++index);
    const target = document.getElementById('typewriter');
    if(target) target.textContent = letter;
    
    if (letter.length === currentText.length) { 
        count++; 
        index = 0; 
        setTimeout(type, 2000); 
    } else { 
        setTimeout(type, 100); 
    }
}());

// --- JAZYK ---
function toggleLanguage() {
    isEnglish = !isEnglish;
    const langBtn = document.getElementById('langBtn');
    
    if (isEnglish) {
        langBtn.textContent = "CZ";
        document.getElementById('btnContact').textContent = "Send Message";
        document.getElementById('btnSave').textContent = "Save";
        document.getElementById('reviewText').textContent = "\"Thanks to the new strategy, revenue doubled. Great job.\"";
        document.getElementById('videoTitle').textContent = "Video Bio";
        document.getElementById('contactTitle').textContent = "Contact Me";
        document.getElementById('qrTitle').textContent = "Scan & Save";
        document.getElementById('sendBtn').textContent = "Send Message";
        showToast('Language: English');
    } else {
        langBtn.textContent = "EN";
        document.getElementById('btnContact').textContent = "Napsat Zprávu";
        document.getElementById('btnSave').textContent = "Uložit";
        document.getElementById('reviewText').textContent = "\"Díky nové strategii se nám ozývá 2x více klientů. Profesionální přístup.\"";
        document.getElementById('videoTitle').textContent = "Video Vizitka";
        document.getElementById('contactTitle').textContent = "Kontakt";
        document.getElementById('qrTitle').textContent = "Scan & Save";
        document.getElementById('sendBtn').textContent = "Odeslat / Send";
        showToast('Jazyk: Čeština');
    }
    updateClock();
}

// --- TILT INICIALIZACE ---
VanillaTilt.init(document.querySelector(".glass-card"), { 
    max: 5, 
    speed: 400, 
    glare: true, 
    "max-glare": 0.2, 
    gyroscope: false 
});