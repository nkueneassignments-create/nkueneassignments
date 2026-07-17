// ===== EDIT THESE 3 LINES =====
const SUPABASE_URL = "https://wircuusdfqnmrewfjagb.supabase.co/rest/v1/";   // from Step 1
const SUPABASE_ANON_KEY = "sb_publishable_Oq4fBe_5aojVD2IfnYAn-A_ZLdc0tAi";                 // from Step 1
const TEACHER_PASSWORD = "nkuene2026";                    // pick your own

// ===== You can also edit these lists to match your school =====
const FORMS = ["Form 2", "Form 3", "Form 4", "Grade 10"];
const STREAMS = ["East", "West", "North", "South"];
const SUBJECTS = ["Mathematics", "English", "Kiswahili", "Biology",
  "Chemistry", "Physics", "History", "Geography", "CRE",
  "Business Studies", "Agriculture", "Computer Studies"];

// ===== Don't touch below this line =====
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function fillSelect(el, items, placeholder) {
  el.innerHTML = `<option value="">${placeholder}</option>` +
    items.map(i => `<option value="${i}">${i}</option>`).join("");
}