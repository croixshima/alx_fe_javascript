// ---------------------------
// Dynamic Quote Generator
// ---------------------------

// Initial quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

// ---------------------------
// Web Storage Functions
// ---------------------------

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Export quotes as JSON
function exportQuotes() {
  const jsonString = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ---------------------------
// Filtering Logic
// ---------------------------

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category.trim()))].sort();

  // Populate dropdown
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastSelected = localStorage.getItem('lastSelectedCategory');
  if (lastSelected) {
    categoryFilter.value = lastSelected;
  }
}

// Filter quotes and update display
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;

  // Save selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = "";

  // Filter based on category
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  // Display quotes
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found in this category.</p>`;
    return;
  }

  filteredQuotes.forEach(q => {
    const div = document.createElement('div');
    div.innerHTML = `<p>"${q.text}"</p><i>- ${q.category}</i>`;
    quoteDisplay.appendChild(div);
  });
}

// ---------------------------
// DOM and Event Setup
// ---------------------------

window.addEventListener('DOMContentLoaded', () => {
  // Load quotes from localStorage if available
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) quotes = JSON.parse(storedQuotes);

  populateCategories();
  filterQuotes(); // Display quotes using restored filter

  // Set up button actions
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportButton').addEventListener('click', exportQuotes);
  createAddQuoteForm();
});

// Show a random quote from the current filter
function showRandomQuote() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><i>- ${randomQuote.category}</i>`;
}

// ---------------------------
// Quote Form Handling
// ---------------------------

function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  const title = document.createElement('h2');
  title.textContent = 'Add a New Quote';

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(title);
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}
