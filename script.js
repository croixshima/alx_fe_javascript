// ===== GLOBAL DATA =====
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

// ===== Storage helpers =====
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ===== Populate categories (global function required by autochecker) =====
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;

  // ensure we have the base option
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // extract unique, non-empty categories
  const categories = Array.from(
    new Set(
      quotes
        .map(q => (q.category || '').toString().trim())
        .filter(c => c.length > 0)
    )
  ).sort();

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  // Restore last selected category from storage if it exists and is valid
  const last = localStorage.getItem('lastSelectedCategory');
  if (last && Array.from(categoryFilter.options).some(o => o.value === last)) {
    categoryFilter.value = last;
  } else {
    // default to 'all' if no valid saved value
    categoryFilter.value = 'all';
  }
}

// ===== filterQuotes must be global and do three things:
// 1) save selected category to localStorage
// 2) filter quotes array by selected category
// 3) update the displayed quotes immediately
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;

  const selectedCategory = categoryFilter.value;

  // 1. Save selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  // 2 & 3. Filter and update the display by calling showRandomQuote,
  // which will use the new category selection.
  showRandomQuote();
}

// ===== showRandomQuote uses current selected filter to choose a random one =====
function showRandomQuote() {
  const categoryFilter = document.getElementById('categoryFilter');
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (!categoryFilter || !quoteDisplay) return;

  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    // Check if the category is 'all' or a specific one for a better message
    if (selectedCategory === 'all') {
         quoteDisplay.innerHTML = `<p>No quotes available. Please add some!</p>`;
    } else {
         quoteDisplay.innerHTML = `<p>No quotes available in the <b>${selectedCategory}</b> category.</p>`;
    }
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<p>"${random.text}"</p><i>- ${random.category}</i>`;
}

// ===== Add quote form and handlers =====
function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Add a New Quote';

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.type = 'text';
  textInput.placeholder = 'Enter a new quote';

  const catInput = document.createElement('input');
  catInput.id = 'newQuoteCategory';
  catInput.type = 'text';
  catInput.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  container.appendChild(title);
  container.appendChild(textInput);
  container.appendChild(catInput);
  container.appendChild(addBtn);
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // update dropdown if new category

  // Set the filter to the newly added category
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.value = category;
  
  filterQuotes(); // This will save the new category and show the new quote
  
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  // Removed the alert for a smoother user experience, as the quote appears immediately
}

// ===== Import/export handlers =====
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

function importFromJsonFileEvent(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return alert('No file selected.');
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) {
        return alert('Invalid JSON format: expected an array of quotes.');
      }
      // Optional: Add logic here to prevent duplicate imports if needed
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch (err) {
      alert('Error parsing JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ===== Initialization on page load =====
window.addEventListener('DOMContentLoaded', () => {
  // Load saved quotes if present
  const stored = localStorage.getItem('quotes');
  if (stored) {
    try { quotes = JSON.parse(stored); } catch (e) { /* ignore parse errors and keep defaults */ }
  }

  createAddQuoteForm();

  // populate categories and restore last selection inside populateCategories
  populateCategories();

  // Immediately filter/display using restored selection
  // This will call showRandomQuote() based on the restored category
  filterQuotes();

  // Event listeners for buttons and import input (category change uses inline onchange)
  const newQuoteBtn = document.getElementById('newQuote');
  if (newQuoteBtn) newQuoteBtn.addEventListener('click', showRandomQuote);

  const exportBtn = document.getElementById('exportButton');
  if (exportBtn) exportBtn.addEventListener('click', exportQuotes);

  const importInput = document.getElementById('importFile');
  if (importInput) importInput.addEventListener('change', importFromJsonFileEvent);
});