// Initialize Clock
function updateClock() {
    const now = new Date();
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
    
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds} UTC`;
}
setInterval(updateClock, 1000);
updateClock();

// Simulation Data
let occupancy = 84;
const totalSpots = 419;

function updateStats() {
    const change = Math.floor(Math.random() * 3) - 1;
    occupancy = Math.max(70, Math.min(95, occupancy + (change * 0.1)));
    
    const occVal = Math.round((occupancy / 100) * totalSpots);
    const availVal = totalSpots - occVal;
    
    // Update Percentage
    document.getElementById('occ-percent').textContent = `${Math.round(occupancy)}%`;
    document.getElementById('occupancy-circle').setAttribute('stroke-dasharray', `${Math.round(occupancy)}, 100`);
    
    // Update Counts
    document.getElementById('occ-count').textContent = occVal;
    document.getElementById('avail-count').textContent = availVal;

    // Random Classification Updates
    if (Math.random() > 0.6) {
        const types = ['sedan', 'suv', 'truck', 'ev'];
        const type = types[Math.floor(Math.random() * types.length)];
        const el = document.getElementById(`${type}-count`);
        const cur = parseInt(el.textContent);
        el.textContent = cur + (Math.random() > 0.5 ? 1 : -1);
    }

    // Add Log Entry
    if (Math.random() > 0.8) {
        const log = document.getElementById('notification-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const now = new Date();
        const time = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
        entry.innerHTML = `<span style="color:var(--primary)">${time}</span> Vehicle identified at sector ${Math.floor(Math.random()*10)+1}`;
        log.insertBefore(entry, log.firstChild);
        if (log.children.length > 8) log.lastChild.remove();
    }
}

setInterval(updateStats, 2500);

// Mode Toggling (Normal vs Thermal)
const modeNormal = document.getElementById('mode-normal');
const modeThermal = document.getElementById('mode-thermal');
const mainFeed = document.getElementById('main-feed');

modeNormal.addEventListener('click', () => {
    modeNormal.classList.add('active');
    modeThermal.classList.remove('active');
    mainFeed.src = 'https://raw.githubusercontent.com/alwaysprince05/ai-parking-analytics/master/web_dashboard/assets/hero.png';
    showToast("SWITCHED TO SPECTRUM MODE", "INFO");
});

modeThermal.addEventListener('click', () => {
    modeThermal.classList.add('active');
    modeNormal.classList.remove('active');
    mainFeed.src = 'https://raw.githubusercontent.com/alwaysprince05/ai-parking-analytics/master/web_dashboard/assets/thermal.png';
    showToast("SWITCHED TO THERMAL MODE", "SECURE");
});

// Toast Notification System
let activeToasts = new Set();

function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    
    // Hard throttle: Don't show the same message if it's already active
    if (activeToasts.has(msg)) return;
    activeToasts.add(msg);
    
    // Clear old toasts if switching modes to keep UI clean
    if (msg.includes("SWITCHED TO")) {
        container.innerHTML = '';
    }

    // Maximum 2 concurrent toasts for ultra-clean UI
    while (container.children.length >= 2) {
        container.removeChild(container.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = "⚠️";
    if (type === "SECURE") icon = "🛡️";
    if (type === "INFO") icon = "ℹ️";
    
    toast.innerHTML = `<span>${icon}</span> <div><strong>${type}</strong><br>${msg}</div>`;
    container.appendChild(toast);
    
    // Auto-dismiss and cleanup
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px) scale(0.9)';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
            activeToasts.delete(msg);
        }, 500);
    }, 3000);
}

// Random Security Alerts
function triggerAlert() {
    const alerts = [
        "UNAUTHORIZED VEHICLE DETECTED IN SECTOR 4",
        "ILLEGAL PARKING AT EMERGENCY EXIT B",
        "ABANDONED PACKAGE DETECTED - SPOT 201",
        "LOW VISIBILITY DETECTED - AI ADJUSTING CONTRAST"
    ];
    if (Math.random() > 0.95) {
        showToast(alerts[Math.floor(Math.random() * alerts.length)], "SECURITY ALERT");
    }
}
setInterval(triggerAlert, 5000);

// Tab Navigation
const viewTitles = {
    monitoring: "Live Feed — Area P7",
    analytics: "Data Intelligence",
    settings: "System Parameters"
};

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        
        // Update Sidebar
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Update View Visibility
        document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`${view}-view`);
        if (target) target.classList.add('active');
        
        // Update Header Title
        const titleEl = document.getElementById('view-title');
        if (titleEl && viewTitles[view]) {
            titleEl.textContent = viewTitles[view];
        }
        
        console.log(`Switched to ${view} view`);
    });
});
