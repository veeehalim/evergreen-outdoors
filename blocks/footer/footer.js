import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);


  const footerColumns = footer.querySelectorAll(".columns-wrapper");
  const classes = ["mottos", "links"];
  classes.forEach((c, i) => {
    footerColumns[i].classList.add(`footer-${c}`);
  });

  const hr = document.createElement("hr");
  const footerMottos = footer.querySelector(".footer-mottos");
  footerMottos.parentNode.insertBefore(hr, footerMottos.nextSibling);


  const footerLinksColumns = footer.querySelector(".footer-links .columns div").children;
  for (let i = 0; i < footerLinksColumns.length; i++) {
    footerLinksColumns[i].classList.add(`column-${i + 1}`);
  }


  const footerLinksWrapper = document.createElement("div");
  footerLinksWrapper.className = "footer-links-wrapper";

  const links = footer.querySelectorAll(
    ".footer-links .columns .column-2 ul"
  )

  links.forEach((link) => {
    link.parentNode.insertBefore(footerLinksWrapper, link);
    footerLinksWrapper.append(link);
  })

  console.log(links);

  block.append(footer);
}
