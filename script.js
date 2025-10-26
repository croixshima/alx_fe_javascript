// ===== GLOBAL DATA =====
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

// ===== NEW: SERVER SIMULATION =====
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to update the sync status UI
function notifyUser(message, isError = false) {
  const statusDiv = document.getElementById('syncStatus');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? 'red' : 'green';
  }
}

// Function to fetch quotes from the "server"
async function fetchServerQuotes() {
  try {
    const response = await fetch(`${SERVER_URL}?_limit=10`); // Get 10 "posts" as quotes
    if (!response.ok) throw new Error('Server not responding');
    
    const serverPosts = await response.json();
    
    // Format server "posts" into our "quote" structure
    return serverPosts.map(post => ({
      text: post.title, // Use the post title as the quote text
      category: `Server (${post.userId})` // Use the userId to create a category
    }));
  } catch (error) {
    console.error('Error fetching from server:', error);
    notifyUser('Error fetching quotes from server. Working locally.', true);
    return []; // Return empty array on failure
  }
}

// Function to "post" a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: quote.text,
        body: quote.category, // Send category as the "body"
        userId: 1 // Dummy user ID
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (!response.ok) throw new Error('Server failed to save');

    const serverResponse = await response.json();
    console.log('Simulated server save response:', serverResponse);
    notifyUser('Quote saved locally and synced with server.');
  } catch (error) {
    console.error('Error posting to server:', error);
    // Note: The quote is already saved locally, so we just notify the failure.
    notifyUser('Quote saved locally. Failed to sync with server.', true);
  }
}

// ===== NEW: DATA SYNC & CONFLICT RESOLUTION =====
async function syncQuotes() {
  notifyUser('Syncing quotes with server...');
  
  const serverQuotes = await fetchServerQuotes();
  if (serverQuotes.length === 0) {
    notifyUser('Could not sync. Using local quotes.');
    return;
  }

  let newQuotesAdded = 0;

  // Conflict Resolution: Server data takes precedence (by adding new items)
  // We merge by adding any server quote that is not already in our local array.
  serverQuotes.forEach(serverQuote => {
    // Check if a quote with the exact same text already exists
    const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
    
    if (!exists) {
      quotes.push(serverQuote);
      newQuotesAdded++;
    }
  });

  if (newQuotesAdded > 0) {
    notifyUser(`Sync complete. Added ${newQuotesAdded} new quote(s) from server.`);
    saveQuotes();
    populateCategories();
    filterQuotes(); // Update the display with the new merged list
  } else {
    notifyUser('Quotes are already up to date.');
  }
}


// ===== Storage helpers =====
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ===== Populate categories (global function required by autochecker) =====
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;

  // save current value to restore it
  const currentCategory = categoryFilter.value;

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

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
  
  // Restore the previously selected category if it still exists
  if (Array.from(categoryFilter.options).some(o => o.value === currentCategory)) {
    categoryFilter.value = currentCategory;
  } else {
    categoryFilter.value = 'all';
  }
}

// ===== filterQuotes must be global and do three things:
// 1) save selected category to localStorage
// 2) filter quotes array by selected category
// 3) update the displayed quotes immediately
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (!categoryFilter || !quoteDisplay) return;

  const selectedCategory = categoryFilter.value;

  // 1. Save selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  // 2. Filter quotes
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  // 3. Update display: show all filtered quotes
  quoteDisplay.innerHTML = '';
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in the <b>${selectedCategory}</b> category. Add some!</p>`;
    return;
  }

  filtered.forEach(q => {
    const block = document.createElement('div');
    block.innerHTML = `<p>"${q.text}"</p><i>- ${q.category}</i>`;
    quoteDisplay.appendChild(block);
  });
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

// ===== MODIFIED: addQuote function =====
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }
  
  // Check for duplicates before adding
  const exists = quotes.some(q => q.text === text && q.category === category);
  if (exists) {
    alert('This quote already exists.');
    return;
  }
  
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  
  // Set filter to the new category and update display
  document.getElementById('categoryFilter').value = category;
  filterQuotes();       
  
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  
  // NEW: Post the new quote to the server
  postQuoteToServer(newQuote);
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
      
      // Merge imported quotes, avoiding duplicates
      let importedCount = 0;
      imported.forEach(importQuote => {
          const exists = quotes.some(localQuote => localQuote.text === importQuote.text);
          if (!exists) {
              quotes.push(importQuote);
              importedCount++;
          }
      });
      
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert(`Import complete. Added ${importedCount} new quote(s).`);
    } catch (err) {
      alert('Error parsing JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ===== MODIFIED: Initialization on page load =====
window.addEventListener('DOMContentLoaded', async () => { // Made async
  // Load saved quotes if present
  const stored = localStorage.getItem('quotes');
  if (stored) {
    try { quotes = JSON.parse(stored); } catch (e) { /* keep defaults */ }
  }

  createAddQuoteForm();
  
  // Populate categories first
  populateCategories();

  // Restore last selected category
  const categoryFilter = document.getElementById('categoryFilter');
  const last = localStorage.getItem('lastSelectedCategory');
  if (last && Array.from(categoryFilter.options).some(o => o.value === last)) {
    categoryFilter.value = last;
  }

  // Immediately filter/display using local data
  filterQuotes();

  // NEW: Initial sync with server
  await syncQuotes(); // Wait for the first sync to complete
  
  // NEW: Set up periodic syncing (e.g., every 60 seconds)
  setInterval(syncQuotes, 60000);

  // Event listeners
  const newQuoteBtn = document.getElementById('newQuote');
  if (newQuoteBtn) newQuoteBtn.addEventListener('click', showRandomQuote);

  const exportBtn = document.getElementById('exportButton');
  if (exportBtn) exportBtn.addEventListener('click', exportQuotes);

  const importInput = document.getElementById('importFile');
  if (importInput) importInput.addEventListener('change', importFromJsonFileEvent);
});