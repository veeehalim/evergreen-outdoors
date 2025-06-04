export default function decorate(block) {
  const productDetails = document.querySelector('.product-details > .product-attributes');
  console.log(productDetails);
  if (productDetails == null) {
    // Set up image container
    const imageContainer = document.querySelector('.product-details > div:first-child');
    imageContainer.classList.add('product-image');

    // Set up product information container
    const productInfoWrapper = document.createElement('div');
    productInfoWrapper.classList.add('product-attributes');
    const productInfo = document.querySelectorAll('.product-details > div:not(:first-child)')
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

    // Add product information container next to image container
    block.append(productInfoWrapper);

    // Remove unnecessary divs
    [...productInfoWrapper.children].forEach((node) => {
      node.replaceWith(...node.childNodes);
    });

    // Add classes and update innerHTML for key product information items
    const productTitle = document.querySelector('.product-attributes > div:first-child');
    productTitle.innerHTML = '<h1>' + productTitle.children[0].innerHTML + '</h1>';
    productTitle.classList.add('product-title');

    const productPrice = document.querySelector('.product-attributes > div:nth-child(3)');
    productPrice.innerHTML = '<p>$' + productPrice.textContent + '</p>';
    productPrice.classList.add('product-price');
  }

  console.log("Product details JS has loaded");
}
