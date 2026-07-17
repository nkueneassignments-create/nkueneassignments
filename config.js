// ===== EDIT THESE 3 LINES =====
const SUPABASE_URL = "https://wircuusdfqnmrewfjagb.supabase.co";   // from Step 1
const SUPABASE_ANON_KEY = "sb_publishable_Oq4fBe_5aojVD2IfnYAn-A_ZLdc0tAi";                 // from Step 1
const TEACHER_PASSWORD = "nkuene2026";                    // pick your own

// ===== You can also edit these lists to match your school =====
const FORMS = ["Form 3", "Form 4", "Grade 10"];
const STREAMS = [

"3P",
"3Q",
"3R",
"3S",
"3T",
"3U",
"3V",
"3W",
"3X",
"3Y",

"4T",
"4U",
"4V",
"4W",
"4X",
"4Y",
"4Z",

"10A",
"10B",
"10C",
"10D",
"10E",
"10F",
"10G",
"10H"
];
const SUBJECTS = ["Mathematics", "English", "Kiswahili", "Biology",
  "Chemistry", "Physics", "History", "Geography", "CRE",
  "Business Studies", "Agriculture", "Computer Studies", "French", "German", "CSL", "ICT"];

// ===== Don't touch below this line =====
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function fillSelect(el, items, placeholder) {
  el.innerHTML = `<option value="">${placeholder}</option>` +
    items.map(i => `<option value="${i}">${i}</option>`).join("");
}
