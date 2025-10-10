import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <h1>Work in progress</h1>
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

// Step 2
const unitLabel = "smiles"; // fun label to match the 😊/😡 theme
let counter: number = 0;

// Counter display
const counterEl = document.createElement("div");
counterEl.id = "counter";
counterEl.setAttribute("role", "status");
counterEl.setAttribute("aria-live", "polite");
counterEl.style.margin = "1rem 0";

function formatCount(n: number): string {
  return `${n} ${unitLabel}`;
}
function renderCounter() {
  counterEl.textContent = formatCount(counter);
}
document.body.appendChild(counterEl);
renderCounter();

// Step 1
// Create a button
const btn = document.createElement("button");
btn.className = "styled";
btn.type = "button";
btn.textContent = "😊";
btn.setAttribute("aria-label", "Emoji button");
btn.setAttribute("aria-pressed", "false");

btn.addEventListener("click", () => {
  counter += 1;
  const isHappy = btn.textContent === "😊";
  btn.textContent = isHappy ? "😡" : "😊";
  btn.setAttribute("aria-pressed", String(!isHappy));
  renderCounter();
});

document.body.appendChild(btn);
