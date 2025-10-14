document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("product-list");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      list.innerHTML = products.map((p) => productCard(p)).join("");
    })
    .catch((err) => {
      list.innerHTML = '<p class="muted">Unable to load products.</p>';
      console.error(err);
    });
});

function productCard(p) {
  return `
    <article class="card">
      <img src="${p.image}" alt="${escapeHtml(p.name)}">
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
    </article>
  `;
}

function escapeHtml(s) {
  if (!s) return "";
  return s.replace(
    /[&<>\"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}
