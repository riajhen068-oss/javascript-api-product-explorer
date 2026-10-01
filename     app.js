const API_URL = "https://dummyjson.com/products?limit=100";

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusText = document.getElementById("status");

let products = [];

async function loadProducts() {
  try {
    statusText.textContent = "Loading products...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    products = data.products || [];

    populateCategories(products);
    renderProducts(products);
    statusText.textContent = `${products.length} products loaded from the API.`;
  } catch (error) {
    statusText.textContent = "Unable to load products. Please try again.";
    statusText.className = "status error";
    console.error(error);
  }
}

function populateCategories(items) {
  const categories = [...new Set(items.map(product => product.category))].sort();

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function renderProducts(items) {
  grid.innerHTML = "";

  if (!items.length) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${escapeHtml(product.title)}">
      <div class="card-body">
        <div class="category">${escapeHtml(product.category)}</div>
        <h2>${escapeHtml(product.title)}</h2>
        <div class="price">$${Number(product.price).toFixed(2)}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(query);
    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
  statusText.textContent = `${filtered.length} matching product(s).`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

loadProducts();
