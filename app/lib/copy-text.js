export default function copyText(text) {
  const node = document.createElement('div');
  node.appendChild(document.createTextNode(text));
  document.body.appendChild(node);

  const range = document.createRange();
  range.selectNodeContents(node);

  getSelection().removeAllRanges();
  getSelection().addRange(range);

  document.execCommand('copy');

  node.remove();
  getSelection().removeAllRanges();
}
