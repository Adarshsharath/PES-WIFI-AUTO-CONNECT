// Run auto login every 20 sec
chrome.alarms.create("pes_check", { periodInMinutes: 0.33 });

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name !== "pes_check") return;

    const { enabled, username, password } = await chrome.storage.local.get([
        "enabled", "username", "password"
    ]);

    if (!enabled || !username || !password) return;

    const online = await hasInternet();
    if (online) return;

    console.log("AUTOLOGIN: No internet, sending login request…");
    sendLogin(username, password);
});

// Check internet
async function hasInternet() {
    try {
        const r = await fetch("https://www.google.com/generate_204");
        return r.status === 204;
    } catch {
        return false;
    }
}

// LOGIN
async function sendLogin(username, password) {
    const body = new URLSearchParams({
        mode: "191",
        username,
        password,
        a: Date.now().toString(),
        producttype: "0"
    });

    try {
        const res = await fetch("http://192.168.254.1:8090/login.xml", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });

        chrome.notifications.create({
            type: "basic",
            title: "PES WiFi",
            message: "Logged in successfully!",
            iconUrl: "icon.png"
        });
    } catch (e) {
        console.log("Login failed", e);
    }
}

// LOGOUT
async function sendLogout(username) {
    const body = new URLSearchParams({
        mode: "193",
        username,
        a: Date.now().toString(),
        producttype: "0"
    });

    try {
        const res = await fetch("http://192.168.254.1:8090/logout.xml", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });

        chrome.notifications.create({
            type: "basic",
            title: "PES WiFi",
            message: "Logged out successfully!",
            iconUrl: "icon.png"
        });
    } catch (e) {
        console.log("Logout failed", e);
    }
}

// Receive popup commands
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "login") sendLogin(msg.username, msg.password);
    if (msg.action === "logout") sendLogout(msg.username);
});
