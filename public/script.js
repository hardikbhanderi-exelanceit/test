// Aurora Jewelry - Enhanced JavaScript
class AuroraJewelry {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("auroraCart")) || [];
    this.products = [];
    this.currentPage = "home";
    this.init();
  }

  init() {
    this.loadProducts();
    this.setupNavigation();
    this.setupCart();
    this.setupFilters();
    this.setupModal();
    this.setupContactForm();
    this.updateCartCount();
    this.updateYear();

    // Set initial page
    this.showPage("home");
  }

  // Load products from API
  async loadProducts() {
    try {
      const response = await fetch("/api/products");
      this.products = await response.json();
      this.renderProducts();
      this.renderFeaturedProducts();
    } catch (error) {
      console.error("Error loading products:", error);
      this.showError("Unable to load products");
    }
  }

  // Navigation
  setupNavigation() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-page]");
      if (link) {
        e.preventDefault();
        const page = link.dataset.page;
        this.showPage(page);
      }
    });
  }

  showPage(page) {
    // Hide all pages
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));

    // Show current page
    const currentPage = document.getElementById(`${page}-page`);
    if (currentPage) {
      currentPage.classList.add("active");
    }

    // Update navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.page === page) {
        link.classList.add("active");
      }
    });

    this.currentPage = page;

    // Page-specific actions
    if (page === "cart") {
      this.renderCart();
    }
  }

  // Product rendering
  renderProducts(productsToRender = this.products) {
    const container = document.getElementById("product-list");
    if (!container) return;

    if (productsToRender.length === 0) {
      container.innerHTML = '<p class="no-products">No products found.</p>';
      return;
    }

    container.innerHTML = productsToRender
      .map((product) => this.createProductCard(product))
      .join("");
  }

  renderFeaturedProducts() {
    const container = document.getElementById("featured-list");
    if (!container) return;

    const featured = this.products.slice(0, 3);
    container.innerHTML = featured
      .map((product) => this.createProductCard(product))
      .join("");
  }

  createProductCard(product) {
    const inCart = this.cart.find((item) => item.id === product.id);
    const buttonText = inCart ? "In Cart" : "Add to Cart";
    const buttonClass = inCart ? "add-to-cart in-cart" : "add-to-cart";

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image" onclick="app.showProductModal(${
          product.id
        })">
          ${this.getProductIcon(product.name)}
        </div>
        <div class="product-info">
          <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
          <p class="product-description">${this.escapeHtml(
            product.description
          )}</p>
          <div class="product-footer">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="${buttonClass}" onclick="app.addToCart(${
      product.id
    })" ${inCart ? "disabled" : ""}>
              ${buttonText}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getProductIcon(name) {
    const icons = {
      pendant: '<i class="fas fa-circle"></i>',
      ring: '<i class="fas fa-ring"></i>',
      bracelet: '<i class="fas fa-circle-notch"></i>',
      necklace: '<i class="fas fa-circle"></i>',
      earrings: '<i class="fas fa-circle"></i>',
    };

    const type = name.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (type.includes(key)) return icon;
    }
    return '<i class="fas fa-gem"></i>';
  }

  // Product modal
  setupModal() {
    const modal = document.getElementById("product-modal");
    const closeBtn = modal.querySelector(".close");

    closeBtn.onclick = () => this.hideModal();
    window.onclick = (e) => {
      if (e.target === modal) this.hideModal();
    };
  }

  showProductModal(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("product-modal");
    const modalBody = document.getElementById("modal-body");

    // Gallery images (for now, just one, but can be expanded)
    const galleryImages = [product.image].concat(product.gallery || []);

    modalBody.innerHTML = `
      <div class="modal-product-details-page">
        <div class="modal-gallery">
          ${galleryImages
            .map(
              (img) =>
                `<img src="${img}" alt="${this.escapeHtml(
                  product.name
                )}" class="modal-gallery-img">`
            )
            .join("")}
        </div>
        <div class="modal-product-info">
          <h2>${this.escapeHtml(product.name)}</h2>
          <div class="modal-product-price">$${product.price.toFixed(2)}</div>
          <p class="modal-product-description">${this.escapeHtml(
            product.description
          )}</p>
          <div class="modal-product-meta">
            <div><strong>Materials:</strong> ${this.escapeHtml(
              product.materials || "Sterling silver, natural stones"
            )}</div>
            <div><strong>Care:</strong> Clean with soft cloth, avoid chemicals</div>
            <div><strong>Shipping:</strong> 3-5 business days</div>
            <div><strong>Availability:</strong> ${
              product.inStock ? "In Stock" : "Out of Stock"
            }</div>
          </div>
          <button class="cta-button" onclick="app.addToCart(${
            product.id
          }); app.hideModal();">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    modal.style.display = "block";
  }

  hideModal() {
    document.getElementById("product-modal").style.display = "none";
  }

  // Cart functionality
  setupCart() {
    this.updateCartCount();
  }

  addToCart(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.renderProducts(); // Re-render to update button states
    this.showNotification(`${product.name} added to cart!`);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  }

  updateQuantity(productId, change) {
    const item = this.cart.find((item) => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCart();
      this.renderCart();
    }
  }

  renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");
    const emptyCart = document.getElementById("empty-cart");

    if (this.cart.length === 0) {
      cartItems.style.display = "none";
      cartSummary.style.display = "none";
      emptyCart.style.display = "block";
      return;
    }

    cartItems.style.display = "block";
    cartSummary.style.display = "block";
    emptyCart.style.display = "none";

    // Render cart items
    cartItems.innerHTML = this.cart
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-image">
          ${this.getProductIcon(item.name)}
        </div>
        <div class="cart-item-info">
          <h4>${this.escapeHtml(item.name)}</h4>
          <p>${this.escapeHtml(item.description)}</p>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="app.updateQuantity(${
            item.id
          }, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="app.updateQuantity(${
            item.id
          }, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(
          2
        )}</div>
        <button class="remove-btn" onclick="app.removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
      )
      .join("");

    // Render cart summary
    const subtotal = this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    cartSummary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping:</span>
        <span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn" onclick="app.checkout()">
        Proceed to Checkout
      </button>
    `;
  }

  updateCartCount() {
    const count = this.cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = count;
      cartCountElement.style.display = count > 0 ? "flex" : "none";
    }
  }

  saveCart() {
    localStorage.setItem("auroraCart", JSON.stringify(this.cart));
  }

  checkout() {
    alert(
      "Thank you for your order! In a real store, this would redirect to payment processing."
    );
  }

  // Filters
  setupFilters() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        const filter = e.target.dataset.filter;
        this.applyFilter(filter);

        // Update active filter button
        document
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
      }
    });
  }

  applyFilter(filter) {
    let filteredProducts = this.products;

    if (filter !== "all") {
      filteredProducts = this.products.filter(
        (product) => product.name.toLowerCase().includes(filter.slice(0, -1)) // Remove 's' from filter
      );
    }

    this.renderProducts(filteredProducts);
  }

  // Contact form
  setupContactForm() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitContactForm(form);
      });
    }
  }

  submitContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    this.showNotification(
      "Thank you for your message! We'll get back to you soon."
    );
    form.reset();
  }

  // Utility functions
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--secondary);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: var(--shadow);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showError(message) {
    const container =
      document.getElementById("product-list") ||
      document.getElementById("featured-list");
    if (container) {
      container.innerHTML = `<p class="error-message">${message}</p>`;
    }
  }

  updateYear() {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Enhanced product data
const enhancedProducts = [
  {
    id: 1,
    name: "Aurora Pendant",
    price: 79.0,
    image: "/images/pendant.jpg",
    description:
      "Elegant sterling silver pendant with crystal accents that capture light beautifully.",
    category: "necklaces",
  },
  {
    id: 2,
    name: "Luna Ring",
    price: 129.0,
    image: "/images/ring.jpg",
    description:
      "Delicate gold-plated ring with moonstone center, perfect for everyday elegance.",
    category: "rings",
  },
  {
    id: 3,
    name: "Solstice Bracelet",
    price: 95.0,
    image: "/images/bracelet.jpg",
    description:
      "Handmade beaded bracelet with mixed metals and natural stone accents.",
    category: "bracelets",
  },
  {
    id: 4,
    name: "Celestial Earrings",
    price: 65.0,
    image: "/images/earrings.jpg",
    description:
      "Star-inspired drop earrings in sterling silver with subtle sparkle.",
    category: "earrings",
  },
  {
    id: 5,
    name: "Infinity Necklace",
    price: 110.0,
    image: "/images/necklace.jpg",
    description:
      "Modern infinity symbol necklace in rose gold with diamond accents.",
    category: "necklaces",
  },
  {
    id: 6,
    name: "Cosmic Ring Set",
    price: 180.0,
    image: "/images/ring-set.jpg",
    description:
      "Set of three stackable rings inspired by planetary movements.",
    category: "rings",
  },
];

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .error-message {
    color: var(--text-secondary);
    text-align: center;
    padding: 40px;
    font-style: italic;
  }
  
  .no-products {
    color: var(--text-secondary);
    text-align: center;
    padding: 40px;
    font-style: italic;
  }
  
  .add-to-cart.in-cart {
    background: var(--accent);
    cursor: not-allowed;
  }
  
  .modal-product {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding: 32px;
  }
  
  .modal-product-image {
    background: linear-gradient(45deg, #f0f0f0, #e8e8e8);
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    color: var(--accent);
    border-radius: var(--border-radius);
  }
  
  .modal-product-info h2 {
    font-family: 'Playfair Display', serif;
    color: var(--primary);
    margin-bottom: 16px;
  }
  
  .modal-product-description {
    color: var(--text-secondary);
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  .modal-product-details {
    margin-bottom: 32px;
  }
  
  .detail {
    margin-bottom: 12px;
    color: var(--text-secondary);
  }
  
  .detail strong {
    color: var(--primary);
  }
  
  .modal-product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-product-price {
    font-size: 24px;
    font-weight: 700;
    color: var(--secondary);
  }
  
  @media (max-width: 768px) {
    .modal-product {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 24px;
    }
    
    .modal-product-image {
      height: 200px;
      font-size: 60px;
    }
  }
`;
document.head.appendChild(style);

// Initialize the application
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new AuroraJewelry();
});
