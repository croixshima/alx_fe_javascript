// ====== GLOBAL DATA ======
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

// ====== STORAGE & FILE HANDLERS ======

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportQuotes() {
  const jsonString = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return alert("No file selected.");

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ====== CORE FUNCTIONS ======

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  const uniqueCategories = Array.from(new Set(quotes.map(q => q.category.trim())));
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.sort().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  // Restore the last selected category
  const last = localStorage.getItem("lastSelectedCategory");
  if (last && [...categoryFilter.options].some(o => o.value === last)) {
    categoryFilter.value = last;
  } else {
    categoryFilter.value = "all";
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!categoryFilter || !quoteDisplay) return;

  const selected = categoryFilter.value;

  // Save selected category
  localStorage.setItem("lastSelectedCategory", selected);

  // Filter quotes and display one randomly
  const filtered =
    selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in the <b>${selected}</b> category.</p>`;
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <i>- ${randomQuote.category}</i>
  `;
}

// ====== ADD NEW QUOTE ======

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = catInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  textInput.value = "";
  catInput.value = "";
  alert("New quote added successfully!");
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const catInput = document.createElement("input");
  catInput.id = "newQuoteCategory";
  catInput.type = "text";
  catInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.append(title, textInput, catInput, addButton);
}

// ====== INITIALIZATION ======

window.addEventListener("DOMContentLoaded", () => {
  // Load quotes from localStorage
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);

  // Create form, populate categories, restore last category
  createAddQuoteForm();
  populateCategories();

  // Show quotes immediately based on restored category
  filterQuotes();

  // Event listeners
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  document.getElementById("exportButton").addEventListener("click", exportQuotes);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
});
