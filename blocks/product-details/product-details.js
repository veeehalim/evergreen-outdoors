import { moveInstrumentation } from '../../scripts/scripts.js';
import { getCartItems, updateCartDetails } from '../header/header.js';

export default function decorate(block) {
  const productDetails = document.querySelector('.product-details > .product-attributes');

  // Set up image container
  const imageContainer = document.querySelector('.product-details > div:first-child');
  imageContainer.classList.add('product-image');

  // Set up product information container
  const productInfoWrapper = document.createElement('div');
  productInfoWrapper.classList.add('product-attributes');
  const productInfo = document.querySelectorAll('.product-details > div:not(.product-image, .product-attributes, :first-child)');
  productInfo.forEach((element) => {
    productInfoWrapper.append(element);
  });

  // Add buttons
  const addToCartBtn = document.createElement('a');
  addToCartBtn.innerHTML = `<a href="#" title="+ Add to bag" class="button cart-button">+ Add to bag</a>`;
  const storeAvailabilityBtn = document.createElement('a');
  storeAvailabilityBtn.innerHTML = `<a href="#" title="Check store availability" class="button secondary">Check store availability</a>`;
  productInfoWrapper.append(addToCartBtn);
  productInfoWrapper.append(storeAvailabilityBtn);

  // Remove unnecessary divs
  [...productInfoWrapper.children].forEach((node) => {
    node.replaceWith(...node.childNodes);
  });

  // Add containers generated to block
  if (productDetails == null) {
    block.append(productInfoWrapper);
  } else {
    block.querySelector('div:first-child').replaceWith(imageContainer);
    moveInstrumentation(productDetails, productInfoWrapper);
    block.append(productInfoWrapper);
  }

  // Add classes and update innerHTML for key product information items
  const productTitle = document.querySelector('.product-attributes > div:first-child:not(.product-title)');
  productTitle.innerHTML = '<h1>' + productTitle.children[0].innerHTML + '</h1>';
  productTitle.classList.add('product-title');

  const productPrice = document.querySelector('.product-attributes > div:nth-child(3)');
  productPrice.innerHTML = '<p>$<span>' + productPrice.textContent + '</span></p>';
  productPrice.classList.add('product-price');

  cartListener();
}

function cartListener() {
  // Add item to cart when CTA button is clicked
  let addToCartBtn = document.querySelector('.product-details .cart-button');

  addToCartBtn.addEventListener('click', () => {
    addItemToCart();
  });
}


function addItemToCart() {
  // Find product details and place in variables
  //const itemImage = document.querySelector('.product-image img');
  const itemTitle = document.querySelector('.product-title h1').textContent;
  const itemPrice = parseInt(document.querySelector('.product-price span').textContent);

  // get existing cart items from local storage
  let cart = getCartItems();

  let isAlreadyInCart = false;
  let index = 0;
  // check if item selected is already in the cart
  // if so, capture index where this item sits
  while (cart.length != 0 && isAlreadyInCart === false && index < cart.length) {
    for (let i = 0; i < cart.length; i++) {
       isAlreadyInCart = (cart[i].title === itemTitle);
       index++;
    }
  }

  // if item is already in the cart, increment qty by 1
  // otherwise, add a new cart item
  if (isAlreadyInCart) {
    cart[index - 1].qty++;
  } else {
    let cartItem = {
      title: itemTitle,
      price: itemPrice,
      qty: 1
    };
    cart.push(cartItem);
  }

  // update local storage with new cart values
  localStorage.setItem('cart', JSON.stringify(cart));

  // update total item count
  let totalItems = localStorage.getItem('totalItems');
  totalItems = (totalItems != null) ? parseInt(totalItems) : 0;
  localStorage.setItem('totalItems', (totalItems + 1));

  // update total price
  let totalPrice = localStorage.getItem('totalPrice');
  totalPrice = (totalPrice != null) ? parseInt(totalPrice) : 0;
  localStorage.setItem('totalPrice', (totalPrice + itemPrice));

  updateCartDetails();
}