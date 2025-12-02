const usn = document.getElementById("usn");
const pass = document.getElementById("pass");
const toggle = document.getElementById("toggle");

// Load saved data
chrome.storage.local.get(["username", "password", "enabled"], data => {
    usn.value = data.username ?? "";
    pass.value = data.password ?? "";
    toggle.checked = data.enabled ?? true;
});

// Save credentials
document.getElementById("save").onclick = () => {
    chrome.storage.local.set({
        username: usn.value,
        password: pass.value
    });
    alert("Saved!");
};

// Manual login
document.getElementById("loginBtn").onclick = () => {
    chrome.runtime.sendMessage({
        action: "login",
        username: usn.value,
        password: pass.value
    });
};

// Manual logout
document.getElementById("logoutBtn").onclick = () => {
    chrome.runtime.sendMessage({
        action: "logout",
        username: usn.value
    });
};

// Toggle auto-login
toggle.onchange = () => {
    chrome.storage.local.set({ enabled: toggle.checked });
};
