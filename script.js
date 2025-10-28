import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://zfiuzdmionjolmbedvpk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaXV6ZG1pb25qb2xtYmVkdnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzk2MzUsImV4cCI6MjA3NzE1NTYzNX0.d2fmy2Fzx26YCJc9tRCykDWrgJHXlzSpXwlnaUj1KrU";
export const supabase = createClient(supabaseUrl, supabaseKey);

/* ---------- SIGN UP ---------- */
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert("Account created successfully!");
      window.location = "dashboard.html";
    }
  });
}

/* ---------- LOGIN ---------- */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Invalid credentials!");
    else window.location = "dashboard.html";
  });
}

/* ---------- LOGOUT ---------- */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    alert("Logged out successfully!");
    window.location = "index.html";
  });
}

/* ---------- UPLOAD FILE ---------- */
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const dept = document.getElementById("dept").value;
    const subject = document.getElementById("subject").value;
    const desc = document.getElementById("desc").value;
    const file = document.getElementById("fileUpload").files[0];
    const category = document.getElementById("category").value; // pdfs, images, pyqs

    if (!file || !dept || !subject) {
      alert("Please fill all details!");
      return;
    }

    const filePath = `${category}/${file.name}`;
    const { data, error } = await supabase.storage
      .from("notes")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("Upload failed!");
      console.error(error);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("notes")
      .getPublicUrl(filePath);

    await supabase.from("notes_meta").insert([
      {
        dept,
        subject,
        desc,
        category,
        file_url: urlData.publicUrl,
        upvotes: 0,
      },
    ]);

    alert("File uploaded successfully!");
    window.location = "dashboard.html";
  });
}

/* ---------- VIEW FILES ---------- */
const notesList = document.getElementById("notesList");
if (notesList) {
  async function loadNotes() {
    const { data, error } = await supabase.from("notes_meta").select("*");
    if (error) return alert("Failed to fetch notes!");

    notesList.innerHTML = "";
    data.forEach((note) => {
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3>${note.subject}</h3>
        <p>${note.desc}</p>
        <p><b>Dept:</b> ${note.dept}</p>
        <p><b>Type:</b> ${note.category}</p>
        <button onclick="window.open('${note.file_url}')">Download</button>
        <button id="upvote-${note.id}">👍 ${note.upvotes}</button>
      `;
      notesList.appendChild(card);

      document
        .getElementById(`upvote-${note.id}`)
        .addEventListener("click", async () => {
          await supabase
            .from("notes_meta")
            .update({ upvotes: note.upvotes + 1 })
            .eq("id", note.id);
          loadNotes();
        });
    });
  }
  loadNotes();
}
