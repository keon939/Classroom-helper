// Load users and posts from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];

function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Sign Up
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const passcode = document.getElementById("signupPasscode").value;

    if (users.find(u => u.name === name)) {
      alert("User already exists");
      return;
    }

    users.push({ name, passcode, role: "student" });
    saveData();
    alert("Account created! Now login.");
    window.location.href = "index.html";
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("loginName").value;
    const passcode = document.getElementById("loginPasscode").value;
    const role = document.getElementById("loginRole").value;

    const user = users.find(
      u => u.name === name && u.passcode === passcode && u.role === role
    );

    if (!user) {
      alert("Invalid login credentials");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "moderator") {
      window.location.href = "moderator.html";
    } else {
      window.location.href = "dashboard.html";
    }
  });
}

// Dashboard posting
function submitPost() {
  const content = document.getElementById("postContent").value;
  if (!content) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  posts.unshift({ user: user.name, content, time: new Date().toLocaleString() });
  saveData();

  document.getElementById("postContent").value = "";
  loadFeed();
}

function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = posts.map(p => `
    <div class="post">
      <strong>${p.user}</strong> <small>${p.time}</small>
      <p>${p.content}</p>
    </div>
  `).join('');
}

// Admin assignment post
function postAssignment() {
  const content = document.getElementById("assignment").value;
  if (!content) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  posts.unshift({ user: `📢 Admin ${user.name}`, content, time: new Date().toLocaleString() });
  saveData();
  alert("Assignment posted!");
  document.getElementById("assignment").value = "";
}

// Moderator view
function loadUserList() {
  const list = document.getElementById("userList");
  if (!list) return;

  list.innerHTML = users.map(u => `
    <li>${u.name} - ${u.role} - 🔐 ${u.passcode}</li>
  `).join('');
}

// Display current user in navbar
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const infoBox = document.getElementById("userInfo") || document.getElementById("adminInfo");
  if (infoBox && user) {
    infoBox.innerHTML = `Logged in as <strong>${user.name}</strong> (${user.role})`;
  }

  loadFeed();
  loadUserList();
};
