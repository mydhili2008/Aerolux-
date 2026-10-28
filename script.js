const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const form = $("#flightForm");
const fromInput = $("#from");
const toInput = $("#to");
const departInput = $("#depart");
const returnInput = $("#return");
const formMessage = $("#formMessage");
const dialog = $("#infoDialog");

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
departInput.min = localDate;
returnInput.min = localDate;
departInput.value = localDate;

function updateReturnMinimum() {
  returnInput.min = departInput.value || localDate;
  if (returnInput.value && departInput.value && returnInput.value < departInput.value) {
    returnInput.value = departInput.value;
  }
}
departInput.addEventListener("change", updateReturnMinimum);

$$(".trip-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".trip-tab").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("selected");
    tab.setAttribute("aria-selected", "true");
    const oneWay = tab.dataset.trip === "oneway";
    const multi = tab.dataset.trip === "multi";
    returnInput.disabled = oneWay || multi;
    returnInput.required = !oneWay && !multi;
    returnInput.style.opacity = oneWay || multi ? ".4" : "1";
    $("#returnHint").textContent = oneWay ? "One-way journey" : multi ? "Multi-city demo mode" : "Add your return date";
    if (oneWay || multi) returnInput.value = "";
    formMessage.textContent = multi
      ? "Multi-city is a visual demo in this version. Search is available for one route at a time."
      : "";
  });
});

$("#swapBtn").addEventListener("click", () => {
  const oldFrom = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = oldFrom;
  formMessage.textContent = "Departure and destination swapped.";
});

function showDialog(title, message) {
  $("#dialogTitle").textContent = title;
  $("#dialogText").textContent = message;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else alert(`${title}\n\n${message}`);
}
$("#closeDialog").addEventListener("click", () => dialog.close());
$("#dialogOk").addEventListener("click", () => dialog.close());
$("#signInBtn").addEventListener("click", () => showDialog("Welcome aboard.", "Sign-in is not connected yet. Add an authentication service and backend to support real user accounts."));
$("#helpBtn").addEventListener("click", () => showDialog("How can we help?", "This demo has no live booking support. For a production site, connect customer support and airline booking services."));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  const trip = $(".trip-tab.selected").dataset.trip;
  if (!from || !to) {
    formMessage.textContent = "Enter both your departure and destination.";
    return;
  }
  if (from.toLowerCase() === to.toLowerCase()) {
    formMessage.textContent = "Departure and destination must be different.";
    return;
  }
  if (!departInput.value) {
    formMessage.textContent = "Please choose a departure date.";
    departInput.focus();
    return;
  }
  if (trip === "round" && !returnInput.value) {
    formMessage.textContent = "Please choose a return date for a round trip.";
    returnInput.focus();
    return;
  }
  if (trip === "round" && returnInput.value < departInput.value) {
    formMessage.textContent = "Return date cannot be earlier than departure date.";
    returnInput.focus();
    return;
  }
  const travellers = $("#travellers").value;
  const cabin = $("#cabin").value;
  const direct = $("#directOnly").checked ? "Direct flights only" : "All flight types";
  showDialog("Your search is ready", `${from} → ${to}\nDeparture: ${departInput.value}${returnInput.value ? `\nReturn: ${returnInput.value}` : ""}\nTravellers: ${travellers}\nCabin: ${cabin}\nPreference: ${direct}\n\nThis website is a front-end demo and does not fetch live flights or create bookings.`);
});

$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#email").value.trim();
  if (!email) return;
  $("#newsletterMessage").textContent = "Thanks! Newsletter sign-up is a demo and your email was not sent.";
  $("#newsletterMessage").style.color = "#397466";
  event.currentTarget.reset();
});

$("#menuToggle").addEventListener("click", () => {
  const nav = $(".desktop-nav");
  nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(nav.classList.contains("open")));
});
$$(".desktop-nav a").forEach((link) => link.addEventListener("click", () => $(".desktop-nav").classList.remove("open")));
