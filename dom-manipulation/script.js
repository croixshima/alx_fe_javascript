// 1. Array of initial quotes (serves as a fallback)
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

// --- Task 2: Web Storage and JSON Functions (Global Scope) ---

/**
 * Saves the current 'quotes' array to localStorage.
 */
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Exports the current 'quotes' array as a JSON file.
 */
function exportQuotes() {
  // 1. Convert quotes array to a JSON string
  // 'null, 2' formats the JSON to be human-readable
  const jsonString = JSON.stringify(quotes, null, 2);

  // 2. Create a Blob (Binary Large Object)
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 3. Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // 4. Create a temporary 'a' (anchor) element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json'; // The filename for the download
  
  // 5. Add the 'a' element to the DOM, click it, and then remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 6. Revoke the object URL to free up memory
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
        // Add the imported quotes to the existing quotes array
        quotes.push(...importedQuotes);
        // Save the new, merged array to local storage
        saveQuotes();
        // Notify the user
        alert('Quotes imported successfully!');
        // Optional: Display a new random quote to show the update
        // showRandomQuote(); // This function isn't in scope here, so we'll skip
      } else {
        alert('Invalid JSON file: The file does not contain a quote array.');
      }
    } catch (error) {
      alert('Error reading or parsing file: ' + error.message);
    }
  };

  // Read the file as text
  fileReader.readAsText(file);
}

// --- Task 1: DOM Manipulation (Runs after page loads) ---
window.addEventListener('DOMContentLoaded', () => {
  
  // Get references to DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const formContainer = document.getElementById('formContainer');
  const exportButton = document.getElementById('exportButton'); // Get the new export button

  /**
   * Loads quotes from local storage.
   * This will overwrite the default 'quotes' array if data exists.
   */
  function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }

  /**
   * Displays a random quote in the quoteDisplay element.
   */
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = '<p>No quotes available. Add some!</p>';
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
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

      // Add to the quotes array
      quotes.push(newQuote);
      
      // *** TASK 2 UPDATE: Save to local storage ***
      saveQuotes();

      // Clear the input fields
      newQuoteTextInput.value = '';
      newQuoteCategoryInput.value = '';

      // Update the DOM
      quoteDisplay.innerHTML = `
        <p>"${newQuote.text}"</p>
        <i>- ${newQuote.category}</i>
      `;
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
  
  // 1. Load quotes from local storage *first*
  loadQuotes();

  // 2. Set up event listeners
  if (newQuoteButton) {
    newQuoteButton.addEventListener('click', showRandomQuote);
  }
  if (exportButton) {
    exportButton.addEventListener('click', exportQuotes);
  }

  // 3. Build the dynamic form
  createAddQuoteForm();

  // 4. Show a random quote on initial page load
  showRandomQuote();
});