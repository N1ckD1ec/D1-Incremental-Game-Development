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
document.body.appendChild(counterEl);

function formatCount(n: number): string {
  // Show integers without decimals, otherwise show two decimals for fractional counts
  const pretty = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return `${pretty} ${unitLabel}`;
}
function renderCounter() {
  counterEl.textContent = formatCount(counter);
}
renderCounter();

// Step 1 — big emoji button
const btn = document.createElement("button");
btn.className = "styled";
btn.type = "button";
btn.textContent = "😊";
btn.setAttribute("aria-label", "Emoji button");
btn.setAttribute("aria-pressed", "false");
document.body.appendChild(btn);

btn.addEventListener("click", () => {
  counter += 1;
  const isHappy = btn.textContent === "😊";
  btn.textContent = isHappy ? "😡" : "😊";
  btn.setAttribute("aria-pressed", String(!isHappy));
  renderCounter();
  updateUpgradeButtons();
});

// Step 4 — growth rate display
const rateEl = document.createElement("div");
rateEl.id = "rate";
rateEl.style.marginTop = "0.5rem";
function renderRate() {
  rateEl.textContent = `growth: ${growthRatePerSec.toFixed(2)} ${unitLabel}/s`;
}
document.body.appendChild(rateEl);
renderRate();

// Time-based animation loop that does NOT assume 60fps
let last = performance.now();
function tick(now: number) {
  const dt = (now - last) / 1000; // seconds since last frame
  last = now;

  if (growthRatePerSec > 0) {
    counter += growthRatePerSec * dt; // fractional growth per frame
    renderCounter();
    updateUpgradeButtons();
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Step 6 — multiple upgrades and status
const shopContainer = document.createElement("div");
shopContainer.style.marginTop = "1rem";
document.body.appendChild(shopContainer);

interface Upgrade {
  key: string;
  name: string;
  cost: number;
  amount: number; // units per second
  purchased: number;
}

const upgrades: Upgrade[] = [
  { key: "💵", name: "💵", cost: 10, amount: 0.1, purchased: 0 },
  { key: "💰", name: "💰", cost: 50, amount: 0.5, purchased: 0 },
  { key: "🪙", name: "🪙", cost: 125, amount: 2.0, purchased: 0 },
];

const upgradeElems: Array<
  { u: Upgrade; btn: HTMLButtonElement; countEl: HTMLElement }
> = [];

const purchasedStatus = document.createElement("div");
purchasedStatus.style.marginTop = "0.5rem";
function renderPurchasedStatus() {
  purchasedStatus.innerHTML = upgrades.map((u) => `${u.name}: ${u.purchased}`)
    .join(" — ");
}
renderPurchasedStatus();

for (const u of upgrades) {
  const row = document.createElement("div");
  row.style.marginTop = "0.5rem";

  const btnU = document.createElement("button");
  btnU.className = "styled";
  btnU.type = "button";
  btnU.textContent = `Buy ${u.name} +${u.amount} auto/s (cost ${u.cost})`;

  const countEl = document.createElement("span");
  countEl.style.marginLeft = "0.75rem";
  countEl.textContent = `x${u.purchased}`;

  btnU.addEventListener("click", () => {
    if (counter >= u.cost) {
      counter -= u.cost;
      growthRatePerSec += u.amount;
      u.purchased += 1;
      // increase the cost by 15% after purchase
      u.cost = Number((u.cost * 1.15).toFixed(2));
      renderCounter();
      renderRate();
      renderPurchasedStatus();
      countEl.textContent = `x${u.purchased}`;
      btnU.textContent = `Buy ${u.name} +${u.amount} auto/s (cost ${u.cost})`;
      updateUpgradeButtons();
    }
  });

  row.appendChild(btnU);
  row.appendChild(countEl);
  shopContainer.appendChild(row);

  upgradeElems.push({ u, btn: btnU, countEl });
}

document.body.appendChild(purchasedStatus);

function updateUpgradeButtons() {
  for (const el of upgradeElems) {
    el.btn.disabled = counter < el.u.cost;
  }
}

updateUpgradeButtons();
