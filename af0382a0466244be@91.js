// https://observablehq.com/@esperanc/tippy-tooltips@91
function _1(md){return(
md`# Tippy tooltips

The \`toolTipper\` function wraps an element with a \`div\`, on which a [Tippy](https://atomiks.github.io/tippyjs/) tooltip is made to appear
as you hover the mouse on it. You define the contents of the tip using a function that receives the (x,y) position of the mouse. The tippy instance properties can also be customized by passing a third argument.`
)}

function _demo(toolTipper,html){return(
toolTipper(
  html`<img src="https://picsum.photos/400/300" height=300 />`,
  (x, y) => `tooltip: ${x},${y}`
)
)}

function _toolTipper(htl,tippy){return(
function toolTipper(element, contentFunc = (x, y) => "", props = {}) {
  const parent = htl.html`<div>`;
  Object.assign(parent.style, {
    position: "relative",
    display: "inline-flex"
  });
  parent.append(element);
  Object.assign(props, {
    followCursor: true,
    allowHTML: true,
    content: contentFunc(0, 0)
  });
  const instance = tippy(parent, props);
  element.onmousemove = element.onmouseenter = (e) => {
    instance.setContent(contentFunc(e.offsetX, e.offsetY));
  };
  return parent;
}
)}

function _tippy(require){return(
require("tippy.js@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("demo")).define("demo", ["toolTipper","html"], _demo);
  main.variable(observer("toolTipper")).define("toolTipper", ["htl","tippy"], _toolTipper);
  main.variable(observer("tippy")).define("tippy", ["require"], _tippy);
  return main;
}
