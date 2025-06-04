export default function decorate(block) {
  const productDetails = document.querySelector('.product-details > .product-attributes');
  console.log("Product details:");
  console.log(productDetails);

  // Set up image container
  const imageContainer = document.querySelector('.product-details > div:first-child');
  imageContainer.classList.add('product-image');

  // Set up product information container
  const productInfoWrapper = document.createElement('div');
  productInfoWrapper.classList.add('product-attributes');
  const productInfo = document.querySelectorAll('.product-details > div:not(:first-child)');
  console.log("Product info wrapper before elements appended: ");
  console.log(productInfo);
  productInfo.forEach((element) => {
    productInfoWrapper.append(element);
  });
  console.log("Product info wrapper after elements appended: ");
  console.log(productInfoWrapper);

  // Add buttons
  const addToCartBtn = document.createElement('a');
  addToCartBtn.innerHTML = `<a href="#" title="+ Add to bag" class="button cart-button">+ Add to bag</a>`;
  const storeAvailabilityBtn = document.createElement('a');
  storeAvailabilityBtn.innerHTML = `<a href="#" title="Check store availability" class="button secondary">Check store availability</a>`;
  productInfoWrapper.append(addToCartBtn);
  productInfoWrapper.append(storeAvailabilityBtn);
  console.log("Product info wrapper after buttons appended: ");
  console.log(productInfoWrapper);

  // Remove unnecessary divs
  [...productInfoWrapper.children].forEach((node) => {
    node.replaceWith(...node.childNodes);
  });
  console.log("Product info wrapper after nodes replaced: ");
  console.log(productInfoWrapper);

  // Add product information container next to image container
  if (productDetails == null) {
    block.append(productInfoWrapper);
    console.log("product details is null");
  } else {
    productDetails.replaceWith(productInfoWrapper);
    console.log("product details is not null");
  }

  // Add classes and update innerHTML for key product information items
  const productTitle = document.querySelector('.product-attributes > div:first-child');
  console.log("Product title before transformation: ");
  console.log(productTitle);
  productTitle.innerHTML = '<h1>' + productTitle.children[0].innerHTML + '</h1>';
  productTitle.classList.add('product-title');
  console.log("Product title after transformation: ");
  console.log(productTitle);

  const productPrice = document.querySelector('.product-attributes > div:nth-child(3)');
  console.log("Product price before transformation: ");
  console.log(productPrice);
  productPrice.innerHTML = '<p>$' + productPrice.textContent + '</p>';
  productPrice.classList.add('product-price');
  console.log("Product price after transformation: ");
  console.log(productPrice);

  console.log("Product details JS has loaded");
}
