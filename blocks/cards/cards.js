import { createOptimizedPicture } from "../../scripts/aem.js";
import { moveInstrumentation } from "../../scripts/scripts.js";

export default function decorate(block) {
  const bodyClassNames = [
    "cards-card-title",
    "cards-card-tag",
    "cards-card-price",
    "cards-card-link",
  ];
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row) => {
    const a = document.createElement("a");
    moveInstrumentation(row, a);
    while (row.firstElementChild) a.append(row.firstElementChild);
    [...a.children].forEach((div, index) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "cards-card-image";
      else if (div.children.length > 0) {
        div.className = `cards-card-body ${bodyClassNames[index - 1]}`;
      }
    });

    const li = document.createElement("li");
    li.appendChild(a);
    ul.append(li);
  });

  ul.querySelectorAll(".cards-card-price p").forEach((p) => {
    if (!p.textContent.startsWith("$")) {
      p.textContent = `$${p.textContent}.00`;
    }
  });

  const cards = ul.querySelectorAll("li");
  cards.forEach((card) => {
    const cardLinkContainer = card.querySelector(".cards-card-link");

    if (cardLinkContainer) {
      const cardLink = cardLinkContainer
        .querySelector("a")
        .getAttribute("title");
      card.querySelector("a").setAttribute("href", cardLink);
      card.querySelector("a").setAttribute("target", "_blank");
      cardLinkContainer.remove();
    }
  });

  ul.querySelectorAll("picture > img").forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: "750" },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector("img"));
    img.closest("picture").replaceWith(optimizedPic);
  });
  block.textContent = "";
  block.append(ul);
}
