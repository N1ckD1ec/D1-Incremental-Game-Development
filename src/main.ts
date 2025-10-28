import "./style.css";

document.body.innerHTML = `
  <h1>Click Them Emojis Bud</h1>
`;

// =============== GAME STATE ===============
// Counter and growth rate variables

// Step 2
const unitLabel = "Emoji"; // fun label to match the 😊/😡 theme
let counter: number = 0;

// Step 5: growth rate starts at 0 (no auto-increase until you buy upgrades)
let growthRatePerSec: number = 0;

// =============== UI ELEMENTS ===============
// Counter display and rate display
// (DOM elements for showing counter, rate, the main clicker, shop and status)
const counterEl = document.createElement("div");
counterEl.id = "counter";
counterEl.setAttribute("role", "status");
counterEl.setAttribute("aria-live", "polite");
counterEl.style.margin = "1rem 0";
document.body.appendChild(counterEl);

// Step 1 — big emoji button
const btn = document.createElement("button");
btn.className = "styled large";
btn.type = "button";
btn.textContent = "😊";
btn.setAttribute("aria-label", "Emoji button");
btn.setAttribute("aria-pressed", "false");
document.body.appendChild(btn);

// Step 4 — growth rate display
const rateEl = document.createElement("div");
rateEl.id = "rate";
rateEl.style.marginTop = "0.5rem";
document.body.appendChild(rateEl);

// Shop container (upgrade UI will be populated later)
const shopContainer = document.createElement("div");
shopContainer.style.marginTop = "1rem";
document.body.appendChild(shopContainer);

// Purchased status element (will be updated after upgrades initialized)
const purchasedStatus = document.createElement("div");
purchasedStatus.style.marginTop = "0.5rem";
document.body.appendChild(purchasedStatus);

// =============== CORE FUNCTIONS ===============
// Utility functions and small helpers
function formatCount(n: number): string {
  // Show integers without decimals, otherwise show two decimals for fractional counts
  const pretty = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return `${pretty} ${unitLabel}`;
}

function renderCounter() {
  counterEl.textContent = formatCount(counter);
}

// Big emoji pool for Step 7 UI — many expressive emoji
const emojiPool = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "☺️",
  "😚",
  "😙",
  "🥲",
  "😏",
  // Tongues, Hands & Accessories
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🫢",
  "🫣",
  "🤫",
  "🤔",
  "🫡",
  "🤤",
  "🤠",
  "🥳",
  "🥸",
  "😎",
  "🤓",
  "🧐",
  // Neutral & Skeptical
  "🙃",
  "🫠",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🫥",
  "😶‍🌫️",
  "😒",
  "🙄",
  "😬",
  "😮‍💨",
  "🤥",
  "🫨",
  "🙂‍↔️",
  "🙂‍↕️",
  // Sleepy & Unwell
  "😌",
  "😔",
  "😪",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "🥴",
  "😵",
  "😵‍💫",
  "🤯",
  "🥱",
  // Concerned & Negative
  "😕",
  "🫤",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "🥹",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫",
  "😤",
  "😡",
  "😠",
  "🤬",
  // Costume, Creature & Animal
  "😈",
  "👿",
  "💀",
  "☠️",
  "💩",
  "🤡",
  "👹",
  "👺",
  "👻",
  "👽",
  "👾",
  "🤖",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "🙈",
  "🙉",
  "🙊",
];

function randomEmoji() {
  return emojiPool[Math.floor(Math.random() * emojiPool.length)];
}

function renderRate() {
  rateEl.textContent = `growth: ${growthRatePerSec.toFixed(2)} ${unitLabel}/s`;
}

// =============== EVENT HANDLERS ===============
// Button click handlers and affordance updates
// Declare upgradeElems early so updateUpgradeButtons can reference it even
// before upgrades are populated later in the file.
const upgradeElems: Array<
  {
    u: { cost: number; purchased?: number };
    btn: HTMLButtonElement;
    countEl: HTMLElement;
  }
> = [];

function updateUpgradeButtons() {
  for (const el of upgradeElems) {
    el.btn.disabled = counter < el.u.cost;
  }
}

// Main click handler for the big emoji button
btn.addEventListener("click", () => {
  counter += 1;
  // Set a random emoji from the pool on each click
  btn.textContent = randomEmoji();
  btn.setAttribute("aria-pressed", "true");
  renderCounter();
  updateUpgradeButtons();
});

// =============== GAME LOOP ===============
// Animation loop that applies fractional growth independent of frame rate
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

// =============== UPGRADE SYSTEM ===============
// Upgrade interface and shop initialization (populated last)
interface Upgrade {
  key: string;
  name: string;
  cost: number;
  amount: number; // units per second
  purchased: number;
  hint?: string;
}

const upgrades: Upgrade[] = [
  {
    key: "Cash",
    name: "💵",
    cost: 10,
    amount: 1,
    purchased: 0,
    hint: "Big Dolla",
  },
  {
    key: "Money Bag",
    name: "💰",
    cost: 50,
    amount: 10,
    purchased: 0,
    hint: "Big Cash Out",
  },
  {
    key: "Gold Coin",
    name: "🪙",
    cost: 125,
    amount: 20,
    purchased: 0,
    hint: "GOLD !!!",
  },
  {
    key: "Diamond",
    name: "💎",
    cost: 5000,
    amount: 100,
    purchased: 0,
    hint: "Mining Diamond I See",
  },
  {
    key: "Stocks",
    name: "💹",
    cost: 10000,
    amount: 1000,
    purchased: 0,
    hint: "Investing In Stonks",
  },
];

function renderPurchasedStatus() {
  purchasedStatus.innerHTML = upgrades.map((u) => `${u.name}: ${u.purchased}`)
    .join(" — ");
}

for (const u of upgrades) {
  const row = document.createElement("div");
  row.style.marginTop = "0.5rem";

  const btnU = document.createElement("button");
  btnU.className = "styled";
  btnU.type = "button";
  // Button shows only name and amount; cost and rate shown on hover via title
  btnU.textContent = `${u.name} +${u.amount}`;
  btnU.title = `${u.hint ? u.hint + " — " : ""}${
    u.amount.toFixed(1)
  } ${unitLabel}/s — cost ${u.cost.toFixed(2)}`;

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
      // update tooltip to show new cost and hint
      btnU.title = `${u.hint ? u.hint + " — " : ""}${
        u.amount.toFixed(1)
      } ${unitLabel}/s — cost ${u.cost.toFixed(2)}`;
      updateUpgradeButtons();
    }
  });

  row.appendChild(btnU);
  row.appendChild(countEl);
  shopContainer.appendChild(row);

  upgradeElems.push({ u, btn: btnU, countEl });
}

// =============== FINAL INITIALIZATION ===============
// Render initial values and start the game loop
renderCounter();
renderRate();
renderPurchasedStatus();
updateUpgradeButtons();
requestAnimationFrame(tick);
