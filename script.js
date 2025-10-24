import { app, auth, db, storage } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

/* ---------- SIGN UP ---------- */
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      window.location = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ---------- LOGIN ---------- */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location = "dashboard.html";
    } catch (err) {
      alert("Invalid credentials!");
    }
  });
}

/* ---------- LOGOUT ---------- */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location = "index.html";
  });
}

/* ---------- UPLOAD ---------- */
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const dept = document.getElementById("dept").value;
    const subject = document.getElementById("subject").value;
    const desc = document.getElementById("desc").value;
    const file = document.getElementById("fileUpload").files[0];
    if (!file || !dept || !subject) {
      alert("Please fill all details!");
      return;
    }

    const storageRef = ref(storage, "notes/" + file.name);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "notes"), {
      dept,
      subject,
      desc,
      fileURL,
      upvotes: 0
    });

    alert("File uploaded successfully!");
    window.location = "notes.html";
  });
}

/* ---------- VIEW NOTES ---------- */
const notesList = document.getElementById("notesList");
if (notesList) {
  async function loadNotes() {
    const querySnapshot = await getDocs(collection(db, "notes"));
    notesList.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3>${data.subject}</h3>
        <p>${data.desc}</p>
        <p><b>Dept:</b> ${data.dept}</p>
        <button onclick="window.open('${data.fileURL}')">Download</button>
        <button id="upvote-${docSnap.id}">👍 ${data.upvotes}</button>
      `;
      notesList.appendChild(card);

      document.getElementById(`upvote-${docSnap.id}`).addEventListener("click", async () => {
        const refDoc = doc(db, "notes", docSnap.id);
        await updateDoc(refDoc, { upvotes: increment(1) });
        alert("Upvoted!");
        loadNotes();
      });
    });
  }
  loadNotes();
}