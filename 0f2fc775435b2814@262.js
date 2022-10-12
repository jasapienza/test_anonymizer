// https://observablehq.com/@esperanc/show-code-utility@262
function _1(md){return(
md`# Show Code Utility

Sometimes you want to export your notebook with the option to exhibit the code to selected cells. This notebook defines the \`cell\` template function, which simulates the behavior of showing/hiding code cells in observable notebooks. `
)}

function _2(md){return(
md`### Example

Suppose you have a cell such as`
)}

function _sqrRootOfTwo(){return(
Math.sqrt(2)
)}

function _4(md){return(
md`then, if you export (or embed) this notebook, you will see the computed value, but not the formula. But you can show the code for the cell by adding another cell defined as

\`\`\`js
cell\`sqrRootOfTwo = Math.sqrt(2)\`
\`\`\`
This cell will display a small button you can click to reveal/hide the code:
`
)}

function _5(cell){return(
cell`sqrRootOfTwo = Math.sqrt(2)`
)}

function _6(md){return(
md`Compare this with the [embedded version](https://observablehq.com/embed/@esperanc/show-code-utility?cell=*) of this notebook`
)}

function _7(md){return(
md`<br>
### Code character escaping utility

Unfortunately, just writing \`cell\`\\\`*code* \\\` will not work if your *code* contains the "\\\`" character. To help with the task of escaping special characters, you can type (or paste) your code in the text area below. After you click the button, the clipboard will be replaced with a proper "show code" code you can then paste in a notebook.`
)}

function _8(escapeUtility){return(
escapeUtility()
)}

function _9(md){return(
md`For instance, here's the code for the \`cell\` template function.<br>`
)}

function _10(cell){return(
cell`cell = function (string, ...args) \{
  const showButton = htl.html\`<div></div>\`;
  Object.assign(showButton.style, \{
    fontSize: "xx-small",
    display: "inline-block",
    fontFamily: "sans-serif",
    border: "1px solid black",
    borderRadius: "3px",
    padding: "0px 4px"
  \});

  const contents = htl.html\`<div>\$\{md\`\\\`\\\`\\\`js\\n\$\{string\}\\\`\\\`\\\`\`\}</div>\`;
  Object.assign(contents.style, \{
    background: "#f0f0f0",
    verticalAlign: "top",
    marginLeft: "5px",
    padding: "0"
  \});

  let show = true;
  const toggleContents = () => \{
    contents.style.display = show ? "inline-block" : "none";
    showButton.innerHTML = show ? "hide" : "show code";
  \};
  toggleContents();
  showButton.onclick = () => \{
    show = !show;
    toggleContents();
  \};
  Object.assign(contents.childNodes[0].style, \{ margin: "0 2px" \});
  return htl.html\`<div>\$\{showButton\}\$\{contents\}</div>\`;
\}`
)}

function _11(md){return(
md`<hr></hr>
### Implementation`
)}

function _cell(htl,md){return(
function (string, ...args) {
  const container = htl.html`<div></div>`;
  Object.assign(container.style, {
    display: "block",
    marginTop: "0px"
  });
  
  const showButton = htl.html`<div></div>`;
  Object.assign(showButton.style, {
    verticalAlign: "top",
    fontSize: "x-small",
    display: "inline-block",
    fontWeight: "medium",
    fontFamily: "sans-serif",
    border: "1px solid black",
    borderRadius: "5px",
    padding: "0px 2px"
  });

  const contents = htl.html`<div>${md`\`\`\`js\n${string}\`\`\``}</div>`;
  Object.assign(contents.style, {
    background: "#f0f0f0",
    verticalAlign: "top",
    marginLeft: "5px",
    padding: "0"
  });
  container.append(showButton, contents);

  let show = false;
  const toggleContents = () => {
    contents.style.display = show ? "inline-block" : "none";
    showButton.innerHTML = show ? "hide" : "show code";
  };
  toggleContents();
  showButton.onclick = () => {
    show = !show;
    toggleContents();
  };
  Object.assign(contents.childNodes[0].style, { margin: "0 0px" });
  return container;
}
)}

function _escapeUtility(htl,copyToClipboard){return(
function () {
  const pasteArea = htl.html`<textarea rows=20 cols=80></textarea>`;
  const but = htl.html`<button>Click here`;
  but.onclick = () => {
    let string = pasteArea.value;
    let result = string.replace(/\\|\`|\{|\}|\$/g, "\\$&");
    result = `cell\`${result}\``;
    pasteArea.value = result;
    copyToClipboard(result);
  };
  return htl.html`${pasteArea}<br>${but}`;
}
)}

function _copyToClipboard(){return(
function copyToClipboard(text) {
  var fakeElem = document.body.appendChild(document.createElement("textarea"));
  fakeElem.style.position = "absolute";
  fakeElem.style.left = "-9999px";
  fakeElem.setAttribute("readonly", "");
  fakeElem.value = text;
  fakeElem.select();
  try {
    return document.execCommand("copy");
  } catch (err) {
    return false;
  } finally {
    fakeElem.parentNode.removeChild(fakeElem);
  }
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("sqrRootOfTwo")).define("sqrRootOfTwo", _sqrRootOfTwo);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["cell"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["escapeUtility"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["cell"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("cell")).define("cell", ["htl","md"], _cell);
  main.variable(observer("escapeUtility")).define("escapeUtility", ["htl","copyToClipboard"], _escapeUtility);
  main.variable(observer("copyToClipboard")).define("copyToClipboard", _copyToClipboard);
  return main;
}
