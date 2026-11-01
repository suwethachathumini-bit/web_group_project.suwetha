const zone      = document.getElementById("dropzone");
const fileInput = document.getElementById("file");
const hint      = document.getElementById("hint");

zone.addEventListener("click", () => fileInput.click());

["dragenter", "dragover"].forEach(ev =>
  zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("over"); }));

["dragleave", "drop"].forEach(ev =>
  zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("over"); }));

zone.addEventListener("drop", e => {
  fileInput.files = e.dataTransfer.files;
  fileInput.dispatchEvent(new Event("change"));
});

fileInput.addEventListener("change", () => {
  const f = fileInput.files[0];
  if (!f) return;
  const ok = /\.(pdf|docx|pptx)$/i.test(f.name) && f.size <= 10 * 1024 * 1024;
  if (ok) {
    hint.textContent = "✔ " + f.name;
  } else {
    hint.textContent = "Only PDF, DOCX, PPTX up to 10 MB";
    fileInput.value = "";
  }
});


const tagInput  = document.getElementById("tagInput");
const tagList   = document.getElementById("tagList");
const tagHidden = document.getElementById("tagsHidden");
let tags = [];

tagInput.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  e.preventDefault();                       
  const t = tagInput.value.trim();
  if (t && !tags.includes(t) && tags.length < 5) {
    tags.push(t);
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;                  
    tagList.appendChild(span);
    tagHidden.value = tags.join(",");     
  }
  tagInput.value = "";
});


document.querySelector("form").addEventListener("reset", () => {
  tags = [];
  tagList.innerHTML = "";
  tagHidden.value = "";
  hint.textContent = "PDF, DOCX, PPTX · max 10 MB";
});

const PER_PAGE    = 2;
const allCards    = document.querySelectorAll(".results .card");
const pager       = document.querySelector(".pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn   = document.getElementById("searchBtn");
let page = 1;

function matchingCards() {
  const q = searchInput.value.trim().toLowerCase();
  return [...allCards].filter(c => c.textContent.toLowerCase().includes(q));
}

function render() {
  const list       = matchingCards();
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  if (page > totalPages) page = totalPages;

  allCards.forEach(c => c.style.display = "none");
  list.slice((page - 1) * PER_PAGE, page * PER_PAGE)
      .forEach(c => c.style.display = "");

  pager.innerHTML = "";
  const addLink = (text, target, cls) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = text;
    if (cls) a.className = cls;
    a.addEventListener("click", e => {
      e.preventDefault();
      if (target >= 1 && target <= totalPages) { page = target; render(); }
    });
    pager.appendChild(a);
  };
  addLink("‹ Prev", page - 1);
  for (let i = 1; i <= totalPages; i++) addLink(i, i, i === page ? "active" : "");
  addLink("Next ›", page + 1);
}

function doSearch() { page = 1; render(); }
searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("input", doSearch);
searchInput.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });

render();
