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
btn.addEventListener("click", () => {
  btn.textContent = btn.textContent === "😊" ? "😡" : "😊";
});

document.body.appendChild(btn);
