// 1. Array of initial quotes
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
  },
  {
    text: "You only live once, but if you do it right, once is enough.",
    category: "Life"
  }
];

// 2. Get references to the DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// 3. Function to show a random quote
function showRandomQuote() {
  // Get a random index from the quotes array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the quoteDisplay element with the new quote
  // We use innerHTML to insert the HTML structure
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <i>- ${randomQuote.category}</i>
  `;
}

// 4. Function to add a new quote
function addQuote() {
  // Get values from the input fields
  const newQuoteTextInput = document.getElementById('newQuoteText');
  const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
  
  const newText = newQuoteTextInput.value;
  const newCategory = newQuoteCategoryInput.value;

  // Check if both fields are filled
  if (newText && newCategory) {
    // Create a new quote object
    const newQuote = {
      text: newText,
      category: newCategory
    };

    // Add the new quote to our array
    quotes.push(newQuote);

    // Clear the input fields
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Optional: Give user feedback
    alert('New quote added successfully!');
    
    // Optional: Show the newly added quote immediately
    quoteDisplay.innerHTML = `
      <p>"${newQuote.text}"</p>
      <i>- ${newQuote.category}</i>
    `;
  } else {
    // Alert the user if fields are empty
    alert('Please enter both a quote and a category.');
  }
}

// 5. Add event listener to the "Show New Quote" button
// This runs the showRandomQuote function every time the button is clicked
newQuoteButton.addEventListener('click', showRandomQuote);

// 6. Show a random quote when the page first loads
// DOMContentLoaded makes sure the script runs after the HTML is fully loaded
window.addEventListener('DOMContentLoaded', showRandomQuote);