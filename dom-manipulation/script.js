// Array of initial quotes
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

// Wait for the DOM to be fully loaded before running script
window.addEventListener('DOMContentLoaded', () => {
  
  // Get references to DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const formContainer = document.getElementById('formContainer');

  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Update the quoteDisplay element
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <i>- ${randomQuote.category}</i>
    `;
  }

  // Function to add a new quote (handles the logic)
  function addQuote() {
    // Get values from the dynamically created inputs
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
    
    const newText = newQuoteTextInput.value;
    const newCategory = newQuoteCategoryInput.value;

    // Check if both fields are filled
    if (newText && newCategory) {
      // Create new quote object
      const newQuote = {
        text: newText,
        category: newCategory
      };

      // Add to the quotes array (Fix for: Check #2)
      quotes.push(newQuote);

      // Clear the input fields
      newQuoteTextInput.value = '';
      newQuoteCategoryInput.value = '';

      // Update the DOM (Fix for: Check #2)
      quoteDisplay.innerHTML = `
        <p>"${newQuote.text}"</p>
        <i>- ${newQuote.category}</i>
      `;
      alert('New quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  // Function to dynamically create the quote form (Fix for: Check #1)
  function createAddQuoteForm() {
    // Create h2 title
    const title = document.createElement('h2');
    title.textContent = 'Add a New Quote';

    // Create text input
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText'; // Give it an ID so addQuote can find it
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    // Create category input
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory'; // Give it an ID
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    // Create button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    
    // Add event listener to the new button
    addButton.addEventListener('click', addQuote);

    // Append all new elements to the form container
    formContainer.appendChild(title);
    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
  }

  // --- SCRIPT EXECUTION ---
  
  // Add event listener to the "Show New Quote" button (Fix for: Check #3)
  // Now it's safely inside DOMContentLoaded
  if (newQuoteButton) {
    newQuoteButton.addEventListener('click', showRandomQuote);
  }

  // Call the function to create the form
  createAddQuoteForm();

  // Show a random quote on initial page load
  showRandomQuote();
});