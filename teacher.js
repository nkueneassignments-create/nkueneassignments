fillSelect(document.getElementById("aForm"), FORMS, "Select Form");
fillSelect(document.getElementById("aSubject"), SUBJECTS, "Select Subject");
fillSelect(document.getElementById("fSubject"), SUBJECTS, "All Subjects");
fillSelect(document.getElementById("fForm"), FORMS, "All Forms");

// ---------- Password check ----------
function checkPassword() {
  if (document.getElementById("pwd").value === TEACHER_PASSWORD) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  } else {
    document.getElementById("pwdMsg").textContent = "Wrong password.";
  }
}

// ---------- Upload assignment ----------
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("uploadBtn");
  const status = document.getElementById("uploadStatus");
  btn.disabled = true;
  status.textContent = "Uploading... ⏳";

  try {
    const file = document.getElementById("aFile").files[0];
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await sb.storage.from("assignments").upload(path, file);
    if (upErr) throw upErr;
    const { data: urlData } = sb.storage.from("assignments").getPublicUrl(path);

    const { error: dbErr } = await sb.from("assignments").insert({
  title: document.getElementById("title").value.trim(),
  form: document.getElementById("aForm").value,
  subject: document.getElementById("aSubject").value,
  term: document.getElementById("aTerm").value,
  year: document.getElementById("aYear").value,
  description: document.getElementById("desc").value.trim(),
  file_url: urlData.publicUrl,
  file_name: file.name
});
    if (dbErr) throw dbErr;

    status.textContent = "✅ Assignment posted!";
    document.getElementById("uploadForm").reset();
  } catch (err) {
    status.textContent = "❌ " + err.message;
  }
  btn.disabled = false;
});

// ---------- Load submissions ----------
async function loadSubmissions() {
  const subject = document.getElementById("fSubject").value;
  const form = document.getElementById("fForm").value;

  let query = sb.from("submissions").select("*").order("created_at", { ascending: false });
  if (subject) query = query.eq("subject", subject);
  if (form) query = query.eq("form", form);

  const { data, error } = await query;
  const list = document.getElementById("submissionList");

  if (error) { list.innerHTML = "<p class='error'>Error loading submissions.</p>"; return; }
  if (data.length === 0) {
    list.innerHTML = "<p class='muted'>No submissions yet.</p>";
    return;
  }

  list.innerHTML = `
    <table>
      <tr><th>Student</th><th>Adm No.</th><th>Class</th><th>Subject</th><th>Date</th><th>File</th></tr>
      ${data.map(s => `
        <tr>
          <td>${s.student_name}</td>
          <td>${s.admission_number}</td>
          <td>${s.form} ${s.stream}</td>
          <td>${s.subject}</td>
          <td>${new Date(s.created_at).toLocaleString()}</td>
          <td><a href="${s.file_url}" target="_blank">View</a></td>
        </tr>`).join("")}
    </table>`;
}
