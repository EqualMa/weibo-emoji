import escapeHtml from "./lib/escape-html";

export default function svgPlaceholder(text: string) {
  const w = text.length;
  const t = escapeHtml(text);
  return `\
<svg width="${w}em" height="1.2em" xmlns="http://www.w3.org/2000/svg">\
<text x="50%" y="1.1em" font-size="1em" \
text-anchor="middle" dominant-baseline="text-after-edge">${t}</text>\
</svg>\
`;
}
