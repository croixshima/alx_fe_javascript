// Array of initial quotes (serves as a fallback)
let quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Motivation"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life"
  },
  {
    text: "Get busy living or get busy dying.",
    category: "Inspiration"
  }
];

// --- Web Storage and JSON Functions (Global Scope) ---

/**
 * Saves the current 'quotes' array to localStorage.
 * This function is called every time a quote is added or imported.
 */
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Exports the current 'quotes' array as a JSON file.
 */
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

/**
 * Imports quotes from a user-selected JSON file.
 * This function is called by the 'onchange' attribute in the HTML.
 */
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert('No file selected.');
    return;
  }

  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes(); // Save the new data
        // *** TASK 3 UPDATE: Repopulate categories after import ***
        populateCategories();
        filterQuotes(); // Update the display
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON file: The file does not contain a quote array.');
      }
    } catch (error) {
      alert('Error reading or parsing file: ' + error.message);
    }
  };

  fileReader.readAsText(file);
}

/**
 * Filters the quotes and updates the display.
 * This function is called by the 'onchange' attribute in the HTML.
 */
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return; // Exit if element doesn't exist yet

  const selectedCategory = categoryFilter.value;

  // *** TASK 3 UPDATE: Save selected filter to local storage ***
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  // Update the displayed quote
  showRandomQuote();
}

// --- DOM Manipulation (Runs after page loads) ---
window.addEventListener('DOMContentLoaded', () => {
  
  // Get references to DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const formContainer = document.getElementById('formContainer');
  const exportButton = document.getElementById('exportButton');
  const categoryFilter = document.getElementById('categoryFilter');


  /**
   * Loads quotes from local storage and restores the last filter.
   */
  function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }

  /**
   * Extracts unique categories and populates the dropdown.
   */
  function populateCategories() {
    // 1. Get unique categories
    const uniqueCategories = ['all'];
    quotes.forEach(quote => {
      const category = quote.category.trim();
      if (category && !uniqueCategories.includes(category)) {
        uniqueCategories.push(category);
      }
    });

    // 2. Clear existing options and re-add 'All Categories'
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // 3. Add unique categories to the dropdown
    uniqueCategories.filter(cat => cat !== 'all').sort().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    // 4. *** TASK 3 UPDATE: Restore the last selected filter ***
    const lastSelected = localStorage.getItem('lastSelectedCategory');
    if (lastSelected) {
      categoryFilter.value = lastSelected;
    }
  }

  /**
   * Displays a random quote *based on the currently selected filter*.
   */
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    
    // 1. Filter the quotes based on the selected category
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = `<p>No quotes available in the **${selectedCategory}** category. Add some!</p>`;
      return;
    }

    // 2. Get a random quote from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <i>- ${randomQuote.category}</i>
    `;
  }

  /**
   * Handles the logic for adding a new quote from the form.
   */
  function addQuote() {
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
    
    const newText = newQuoteTextInput.value.trim();
    const newCategory = newQuoteCategoryInput.value.trim();

    if (newText && newCategory) {
      const newQuote = {
        text: newText,
        category: newCategory
      };

      quotes.push(newQuote);
      saveQuotes(); // Save new quote to local storage

      // *** TASK 3 UPDATE: Repopulate categories if a new one was added ***
      populateCategories();

      // Clear the input fields
      newQuoteTextInput.value = '';
      newQuoteCategoryInput.value = '';

      // Update the display to show the new quote
      showRandomQuote();
      alert('New quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  /**
   * Dynamically creates and appends the "Add Quote" form.
   */
  function createAddQuoteForm() {
    const title = document.createElement('h2');
    title.textContent = 'Add a New Quote';

    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    formContainer.appendChild(title);
    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
  }

  // --- SCRIPT EXECUTION ---
  
  // 1. Load quotes and restore category list
  loadQuotes();
  populateCategories();

  // 2. Set up event listeners
  if (newQuoteButton) {
    newQuoteButton.addEventListener('click', showRandomQuote);
  }
  if (exportButton) {
    exportButton.addEventListener('click', exportQuotes);
  }
  // The 'categoryFilter' change listener is set in the HTML using onchange="filterQuotes()"

  // 3. Build the dynamic form
  createAddQuoteForm();

  // 4. Show a random quote using the restored or default filter
  showRandomQuote();
});