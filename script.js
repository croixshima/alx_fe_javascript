// ====== GLOBAL DATA ======
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

// ====== STORAGE FUNCTIONS ======

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== POPULATE CATEGORY DROPDOWN ======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // Get unique categories
  const categories = Array.from(new Set(quotes.map(q => q.category.trim()))).sort();

  // Reset dropdown options
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  // Restore last selected category from localStorage
  const lastSelected = localStorage.getItem("lastSelectedCategory");
  if (lastSelected && [...categoryFilter.options].some(o => o.value === lastSelected)) {
    categoryFilter.value = lastSelected;
  } else {
    categoryFilter.value = "all";
  }
}

// ====== FILTER & DISPLAY QUOTES ======
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (!categoryFilter || !quoteDisplay) return;

  const selectedCategory = categoryFilter.value;

  // Save selected category to localStorage
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  // Filter quotes based on selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  // Update the displayed quote
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in the <b>${selectedCategory}</b> category.</p>`;
  } else {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <i>- ${randomQuote.category}</i>
    `;
  }
}

// ====== ADD QUOTE ======
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
  alert("New quote added successfully!");
}

// ====== CREATE ADD QUOTE FORM ======
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.append(title, textInput, categoryInput, addButton);
}

// ====== INITIALIZATION ======
window.addEventListener("DOMContentLoaded", () => {
  // Load quotes from localStorage if available
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);

  // Populate categories and restore last selected one
  populateCategories();

  // Create add-quote form
  createAddQuoteForm();

  // Apply filter immediately on load (restored category)
  filterQuotes();

  // Set up event listeners
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  document.getElementById("exportButton").addEventListener("click", () => {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById("importFile").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return alert("No file selected.");
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          quotes.push(...imported);
          saveQuotes();
          populateCategories();
          filterQuotes();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON file format.");
        }
      } catch (err) {
        alert("Error reading file: " + err.message);
      }
    };
    reader.readAsText(file);
  });
});
