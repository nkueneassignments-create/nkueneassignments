// Fill the dropdowns
fillSelect(document.getElementById("filterForm"), FORMS, "Form/Grade");
fillSelect(document.getElementById("filterStream"), STREAMS, "Stream");
fillSelect(document.getElementById("filterSubject"), SUBJECTS, "Subject");
fillSelect(document.getElementById("subForm"), FORMS, "Select Form");
fillSelect(document.getElementById("subStream"), STREAMS, "Select Stream");
fillSelect(document.getElementById("subSubject"), SUBJECTS, "Select Subject");

let currentAssignments = [];

// ---------- Load assignments ----------
async function loadAssignments() {
  const form = document.getElementById("filterForm").value;
  const stream = document.getElementById("filterStream").value;
  const subject = document.getElementById("filterSubject").value;

  let query = sb.from("assignments").select("*").order("created_at", { ascending: false });
  if (form) query = query.eq("form", form);
  if (stream) query = query.eq("stream", stream);
  if (subject) query = query.eq("subject", subject);

  const { data, error } = await query;
  const list = document.getElementById("assignmentList");

  if (error) { list.innerHTML = "<p class='error'>Error loading assignments.</p>"; return; }
  currentAssignments = data;

  if (data.length === 0) {
    list.innerHTML = "<p class='muted'>No assignments found for that selection.</p>";
  } else {
    list.innerHTML = data.map(a => `
      <div class="item">
        <div>
          <strong>${a.title}</strong><br>
          <span class="muted">${a.subject} • ${a.form} ${a.stream} •
          ${new Date(a.created_at).toLocaleDateString()}</span>
          ${a.description ? `<p>${a.description}</p>` : ""}
        </div>
        <a class="btn" href="${a.file_url}" target="_blank">⬇ Download</a>
      </div>`).join("");
  }

  // Also fill the "which assignment are you submitting?" dropdown
  document.getElementById("subAssignment").innerHTML =
    `<option value="">Select assignment</option>` +
    data.map(a => `<option value="${a.id}">${a.title} (${a.subject})</option>`).join("");
}

// ---------- Submit student work ----------
document.getElementById("submitForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("submitStatus");
  btn.disabled = true;
  status.textContent = "Uploading... please wait ⏳";

  try {
    const file = document.getElementById("subFile").files[0];
    if (file.size > 50 * 1024 * 1024) throw new Error("File is too big (max 50 MB).");

    // 1. Upload the file to storage
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await sb.storage.from("submissions").upload(path, file);
    if (upErr) throw upErr;
    const { data: urlData } = sb.storage.from("submissions").getPublicUrl(path);

    // 2. Save the details in the database
    const { error: dbErr } = await sb.from("submissions").insert({
      assignment_id: document.getElementById("subAssignment").value || null,
      student_name: document.getElementById("studentName").value.trim(),
      admission_number: document.getElementById("admNumber").value.trim(),
      form: document.getElementById("subForm").value,
      stream: document.getElementById("subStream").value,
      subject: document.getElementById("subSubject").value,
      file_url: urlData.publicUrl,
      file_name: file.name
    });
    if (dbErr) throw dbErr;

    status.textContent = "✅ Submitted successfully! Well done.";
    document.getElementById("submitForm").reset();
  } catch (err) {
    status.textContent = "❌ " + err.message;
  }
  btn.disabled = false;
});