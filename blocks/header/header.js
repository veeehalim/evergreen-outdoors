import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = "";
    brandLink.closest(".button-container").className = "";
    brandLink.textContent = "";
    brandLink.innerHTML = `<img src="/icons/logo.svg" alt="Logo" />`;
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const categoryImages = navSections.querySelectorAll(
      ".default-content-wrapper > p"
    );

    navSections
      .querySelectorAll(":scope .default-content-wrapper > ul > li")
      .forEach((navSection, index) => {
        if (navSection.querySelector("ul"))
          navSection.classList.add("nav-drop");
        
        const submenuItems = navSection.querySelector("ul");
        const submenuWrapper = document.createElement("div");
        submenuWrapper.className = "nav-submenu-wrapper";
        submenuItems.parentNode.insertBefore(submenuWrapper, submenuItems);

        const submenu = document.createElement("div");
        submenu.className = "nav-submenu";
        submenu.appendChild(categoryImages[index]);
        submenu.appendChild(submenuItems);
        
        submenuWrapper.appendChild(submenu);

        navSection.addEventListener("click", () => {
          if (isDesktop.matches) {
            const expanded =
              navSection.getAttribute("aria-expanded") === "true";
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  toggleCartModal();
  updateCartDetails();
}

/* ===== Add to cart functionality ===== */

// Toggle cart modal when icon is clicked in nav
function toggleCartModal() {
  const iconContainer = document.querySelector('.nav-tools .default-content-wrapper');
  const cart = document.querySelector('.nav-tools .icon-cart');

  const cartModal = document.createElement('div');
  cartModal.classList.add('cart-popup', 'd-none');
  cartModal.innerHTML = `<div class='cart-summary'>
                            <p><span class='total-items'>0</span> items in bag</p>
                            <p>Bag subtotal: $<span class='total-price'>0</span></p>
                            <button>Proceed to checkout</button>
                            <hr>
                            <div class='item-summary'></div>
                         </div>
                         <div class='no-items'>
                            <p>There are no items in your bag</p>
                            <button>Continue shopping</button>
                         </div>`;
  iconContainer.append(cartModal);

  cart.addEventListener('click', () => {
    if (cartModal.classList.contains('d-none')) {
      cartModal.classList.remove('d-none');
    } else {
      cartModal.classList.add('d-none');
    }
  });
}

export function getCartItems() {
  let cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function updateCartDetails() {
  const cartModal = document.querySelector('.cart-popup');

  let cart = getCartItems();
  let totalItems = localStorage.getItem('totalItems');
  let totalPrice = localStorage.getItem('totalPrice');

  let cartSummaryContainer = document.querySelector('.cart-popup .cart-summary');
  let noItemsContainer = document.querySelector('.no-items');
  if (cart.length === 0) {
    noItemsContainer.classList.remove('d-none');
    cartSummaryContainer.classList.add('d-none');
  } else {
    cartSummaryContainer.classList.remove('d-none');
    noItemsContainer.classList.add('d-none');
    populateCartProducts(cart);
  }

  let totalItemsPlaceholder = document.querySelector('.total-items');
  totalItemsPlaceholder.textContent = totalItems;

  let totalPricePlaceholder = document.querySelector('.total-price');
  totalPricePlaceholder.textContent = totalPrice;
}

function populateCartProducts(cart) {
  let cartProductsContainer = document.querySelector('.item-summary');
  cartProductsContainer.innerHTML = '';

  for (let i = 0; i < cart.length; i++) {
    let productTitle = cart[i].title;
    let productQty = cart[i].qty;
    let productPrice = cart[i].price;

    let productItemContainer = document.createElement('div');
    productItemContainer.classList.add('product-item');
    let column1 = document.createElement('div');
    let column2 = document.createElement('div');

    let productTitleEl = document.createElement('p');
    productTitleEl.textContent = productTitle;
    let productQtyEl = document.createElement('p');
    productQtyEl.textContent = "Quantity: " + productQty;

    column1.append(productTitleEl);
    column1.append(productQtyEl);

    let productPriceEl = document.createElement('p');
    let totalProductPrice = productPrice * productQty;
    productPriceEl.textContent = "$" + totalProductPrice.toString();

    column2.append(productPriceEl);

    productItemContainer.append(column1);
    productItemContainer.append(column2);

    cartProductsContainer.append(productItemContainer);
  }
}
