let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to predict the future is to create it.", category: "Motivation" },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 3, text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { id: 4, text: "The journey of a thousand miles begins with a single step.", category: "Philosophy" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) categoryFilter.value = lastCategory;
}

function displayRandomQoute() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function filterQuotes() {
  localStorage.setItem("lastCategory", categoryFilter.value);
  displayRandomQoute();
}


function addQoute() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (!text || !category) {
    alert("Tell me and I forget. Teach me and I remember. Involve me and I learn.Education.");
    return;
  }

  const newQuote = { id: Date.now(), text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  quoteDisplay.textContent = `"${text}" — (${category})`;
  newQuoteText.value = "";
  newQuoteCategory.value = "";

   syncToServer(newQuote);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expected an array.");
      }
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

        const serverQuotes = data.slice(0, 5).map((item, i) => ({
      id: item.id,
      text: item.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (err) {
    console.error("Error fetching from server:", err);
    syncStatus.textContent = "Status: Sync failed";
    syncStatus.style.color = "red";
  }
}

sync function syncToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" }
    });
    syncStatus.textContent = "Status: Quote synced to server";
    syncStatus.style.color = "green";
  } catch (err) {
    console.error("Error syncing to server:", err);
    syncStatus.textContent = "Status: Sync failed";
    syncStatus.style.color = "red";
  }
}
function resolveConflicts(serverQuotes) {
  let conflicts = 0;

  serverQuotes.forEach(sq => {
    const index = quotes.findIndex(lq => lq.id === sq.id);
    if (index >= 0) {
      // Conflict: overwrite local with server
      if (quotes[index].text !== sq.text) {
        quotes[index] = sq;
        conflicts++;
      }
    } else {
      
      quotes.push(sq);
    }
  });

  saveQuotes();
  populateCategories();

  if (conflicts > 0) {
    syncStatus.textContent = `Status: ${conflicts} conflicts resolved (server version kept)`;
    syncStatus.style.color = "orange";
  } else {
    syncStatus.textContent = "Status: Synced with server";
    syncStatus.style.color = "green";
  }
}

setInterval(fetchFromServer, 15000);

newQuoteBtn.addEventListener("click", displayRandomQoute);
addQuoteBtn.addEventListener("click", addQoute);
exportBtn.addEventListener("click", exportToJsonFile);

populateCategories();
if (sessionStorage.getItem("lastQuote")) {
  const last = JSON.parse(sessionStorage.getItem("lastQuote"));
  quoteDisplay.textContent = `"${last.text}" — (${last.category})`;
} else {
  displayRandomQoute();
}



 
