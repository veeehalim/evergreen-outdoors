import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {

  [...block.children].forEach((row) => {
    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    moveInstrumentation(label, summary);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    // decorate accordion item
    details.append(summary, body);
    row.replaceWith(details);
  });
}