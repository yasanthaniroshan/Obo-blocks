import "./styles/index.css";

import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";

import {
  editor,
  insertPythonSnippet,
  makeUneditable,
  saveAsPythonFile,
  loadModifiedCode,
  saveModifideCode,
} from "./editor/editor";

import Sk from "./skulpt/skulpt";
import { outputfun, inputfun ,builtinRead } from "./skulpt/functions";

let editable = false;
let ws;

// ------------------ Elements -------------------------

const editbutton = document.getElementById("edit-button");
// const codeDiv = document.getElementById('generatedCode').firstChild;
const blocklyDiv = document.getElementById("editor");
const imageEDit = document.getElementById("editing-image");
const copyButton = document.getElementById("copy-button");
const runcodeButton = document.getElementById("run-button");
const clearButton = document.getElementById("clear-button");
const stopButton = document.getElementById("stop-button");
const exportButton = document.getElementById("export-button");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");
const runButtonText = document.getElementById("run-text");
const editbuttonText = document.getElementById("edit-text");
const codeDiv = document.getElementById("code");
const outputDiv = document.getElementById("output");
let terminal = document.getElementById('terminal-output');


// ------------------- Event Listners -----------------------------
// obo_blocks_logo.src = oboBlocksLogo
// academy_logo.src = academyLogo
// ------------------- Blockly Configuration -------------------------

// ----------------------- Function defintions --------------------------------
async function runcode() {
  let code = editor.state.doc.toString();
  var myPromise = Sk.misceval.asyncToPromise(function () {
    return Sk.importMainWithBody("<stdin>", false, code, true);
  });
  myPromise.then(
    function (mod) {
      console.log("success");
    },
    function (err) {
      console.log(err.toString());
    }
  );
}

async function copyTextToClipboard(textToCopy) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    }
  } catch (err) {
    console.error("Error copying text to clipboard:", err);
  }
}

function showNotification(message) {
  notificationText.innerText = message;

  // Show the notification
  notification.classList.add("show");

  // Hide the notification after 2 seconds
  setTimeout(function () {
    notification.classList.remove("show");
  }, 1500);
}

let totalSizeWindowSizw =
  parseInt(codeDiv.getBoundingClientRect().height.toFixed(0)) +
  parseInt(outputDiv.getBoundingClientRect().height.toFixed(0));
let oldcodeSize = codeDiv.getBoundingClientRect().height.toFixed(0);
let newoutputSize = outputDiv.getBoundingClientRect().height.toFixed(0);

function resizeRightColumn() {
  let newcodeSize = codeDiv.getBoundingClientRect().height.toFixed(0);
  if (
    newcodeSize < 500 &&
    newcodeSize > 300 &&
    newcodeSize < totalSizeWindowSizw
  ) {
    let outputSize = totalSizeWindowSizw - newcodeSize; // Replace codeSize with newcodeSize
    console.log("Output Size: ", totalSizeWindowSizw);
    outputDiv.style.height = outputSize + "px";
    oldcodeSize = newcodeSize;
  }
}

if ("ResizeObserver" in window) {
  // Create a new ResizeObserver
  const resizeObserver = new ResizeObserver(resizeRightColumn);
  // Start observing the element
  resizeObserver.observe(codeDiv);
} else {
  console.log("Resize Observer not supported in this browser.");
}
// ------------------------ Initializations -----------------------------------------------------------

function readinput()
{
  code = editor.state.doc.toString();
  return code;
}

Sk.configure({ output: outputfun, read: builtinRead });
(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "editor";

// ------------------------ Event Listners -----------------------------------------------------------

editbutton.addEventListener("click", function () {
  editable = !editable;
  makeUneditable(editable);

  if (editable) {
    showNotification("Editing enabled");
    editbuttonText.innerHTML = "Editing";
    loadModifiedCode();
  } else {
    editbuttonText.innerHTML = "Edit";
    blocklyDiv.style.display = "block";
    saveModifideCode();
    showNotification("Editing disabled");
  }
});
copyButton.addEventListener("click", () => {
  let code = editor.state.doc.toString();
  if (code === "") {
    showNotification("No code to copy");
    return;
  }
  copyTextToClipboard(code);
  showNotification("Code copied to clipboard");
});

runcodeButton.addEventListener("click", () => {
  runcode();
});

clearButton.addEventListener("click", () => {
  terminal.innerHTML = "Python 3.10 \n>>> ";
  showNotification("Terminal cleared");
});

stopButton.addEventListener("click", () => {
  stopWorker();
});

exportButton.addEventListener("click", () => {
  const content = editor.state.doc.toString();
  if (content === "") {
    showNotification("No code to export");
    return;
  }
  saveAsPythonFile(content);
  showNotification("Code exported as script.py");
});

document.addEventListener("DOMContentLoaded", () => {
  makeUneditable(editable);
  showNotification("Welcome to Python Editor");
  terminal.innerHTML = "Python 3.10 \n>>> ";
  notification.style.transition = "opacity 0.5s ease-in-out";
});
