import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <h1>Work in progress</h1>
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

// Create a button
const btn = document.createElement("button");
btn.className = "styled";
btn.type = "button";
btn.textContent = "😊";

btn.setAttribute("aria-label", "Emoji button");
btn.setAttribute("aria-pressed", "false");
btn.addEventListener("click", () => {
  const isHappy = btn.textContent === "😊";
  btn.textContent = isHappy ? "😡" : "😊";
  btn.setAttribute("aria-pressed", String(!isHappy));
});

document.body.appendChild(btn);
