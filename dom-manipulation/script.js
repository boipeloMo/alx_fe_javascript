let quotes = [
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

function displayRandomQoute() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
}

function addQoute() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === "" || category === "") {
    alert("The journey of a thousand miles begins with a single step. Philosophy.");
    return;
  }

    quotes.push({ text, category });

   quoteDisplay.textContent = `"${text}" — (${category})`;

  // Clear input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

newQuoteBtn.addEventListener("click", displayRandomQoute);
addQuoteBtn.addEventListener("click", addQoute);

// Initialize default display
displayRandomQoute();
