import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <h1>Work in progress</h1>
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

// Step 2
const unitLabel = "smiles"; // fun label to match the 😊/😡 theme
let counter: number = 0;

// Step 5: growth rate starts at 0 (no auto-increase until you buy upgrades)
let growthRatePerSec: number = 0;

// Counter display
const counterEl = document.createElement("div");
counterEl.id = "counter";
counterEl.setAttribute("role", "status");
counterEl.setAttribute("aria-live", "polite");
counterEl.style.margin = "1rem 0";

function formatCount(n: number): string {
  // Show integers without decimals, otherwise show two decimals for fractional counts
  const pretty = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return `${pretty} ${unitLabel}`;
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
  // If manual clicks make an upgrade affordable, update the shop button state
  updateUpgradeButton();
});

document.body.appendChild(btn);

// Step 3
// Simulate a user click so the same click handler runs (toggles emoji, updates aria, and increments)
//const _intervalId = setInterval(() => {
// Helpful debug output so developers can see automatic clicks in the console
//console.debug("autoclick");
// Use the button's click event so all UI updates stay in one place
//btn.click();
//}, 1000);

// Visible autoclick counter for quick verification without opening the console
//const autoEl = document.createElement("div");
//autoEl.id = "autoclick-status";
//autoEl.style.marginTop = "0.5rem";
//let autoCount = 0;
//function renderAuto() {
//autoEl.textContent = `autoclicks: ${autoCount}`;
//}
//renderAuto();
//document.body.appendChild(autoEl);

// Increment visible count whenever the automatic interval runs
//const _intervalViz = setInterval(() => {
//autoCount += 1;
//renderAuto();
//}, 1000);

//Step 4
const rateEl = document.createElement("div");
rateEl.id = "rate";
rateEl.style.marginTop = "0.5rem";
function renderRate() {
  rateEl.textContent = `growth: ${growthRatePerSec.toFixed(2)} ${unitLabel}/s`;
}
renderRate();
document.body.appendChild(rateEl);

// Time-based animation loop that does NOT assume 60fps
let last = performance.now();
function tick(now: number) {
  const dt = (now - last) / 1000; // seconds since last frame
  last = now;

  if (growthRatePerSec > 0) {
    counter += growthRatePerSec * dt; // fractional growth per frame
    renderCounter();
    updateUpgradeButton();
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

//Step 5
const shopContainer = document.createElement("div");
shopContainer.style.marginTop = "1rem";

const upgradeBtn = document.createElement("button");
upgradeBtn.id = "upgrade";
upgradeBtn.className = "styled";
upgradeBtn.type = "button";
upgradeBtn.textContent = "Buy +0.1 auto/s (cost 10)";
upgradeBtn.disabled = true;

upgradeBtn.addEventListener("click", () => {
  const cost = 10;
  if (counter >= cost) {
    counter -= cost;
    growthRatePerSec += 0.1;
    renderCounter();
    renderRate();
    updateUpgradeButton();
  }
});

shopContainer.appendChild(upgradeBtn);
document.body.appendChild(shopContainer);

// Enable/disable upgrade button based on affordability
function updateUpgradeButton() {
  const cost = 10;
  upgradeBtn.disabled = counter < cost;
}
updateUpgradeButton();
