export default function copyText(copyText) {
  const node = document.createElement('div');
  node.appendChild(document.createTextNode(copyText));
  document.body.appendChild(node);

  const range = document.createRange();
  range.selectNodeContents(node);

  getSelection().removeAllRanges();
  getSelection().addRange(range);

  document.execCommand('copy');

  node.remove();
  getSelection().removeAllRanges();
}
