let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The journey of a thousand miles begins with a single step.", category: "Philosophy" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const exportBtn = document.getElementById("exportBtn");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function displayRandomQoute() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQoute() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("The journey of a thousand miles begins with a single step.Philosophy.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes(); // Save updated quotes to localStorage

  quoteDisplay.textContent = `"${text}" — (${category})`;

  newQuoteText.value = "";
  newQuoteCategory.value = "";
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
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expected an array of quotes.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

newQuoteBtn.addEventListener("click", displayRandomQoute);
addQuoteBtn.addEventListener("click", addQoute);
exportBtn.addEventListener("click", exportToJsonFile);

if (sessionStorage.getItem("lastQuote")) {
  const last = JSON.parse(sessionStorage.getItem("lastQuote"));
  quoteDisplay.textContent = `"${last.text}" — (${last.category})`;
} else {
  displayRandomQoute();
}
