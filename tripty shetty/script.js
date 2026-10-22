const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const nav = $("#nav");
const toggle = $("#navToggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  $$(".nav__link, .nav__cta").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
    })
  );
}

const form = $("#quoteForm");
if (form) {
  const summary = $("#formErrors");
  const msgs = {
    name: "Enter your full name",
    phone: "Enter your phone number",
    email: "Enter a valid email address",
    message: "Describe your matter",
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = [];
    $$("input, textarea", form).forEach((f) => {
      let msg = "";
      if (f.required && !f.value.trim()) msg = msgs[f.name] || "This field is required";
      else if (f.type === "email" && f.value && !/^\S+@\S+\.\S+$/.test(f.value)) msg = msgs.email;
      f.classList.toggle("is-invalid", !!msg);
      if (msg) {
        f.setAttribute("aria-invalid", "true");
        bad.push({ f, msg });
      } else {
        f.removeAttribute("aria-invalid");
      }
    });
    if (bad.length) {
      summary.innerHTML =
        "<strong>There is a problem</strong><ul>" +
        bad.map((b) => `<li><a href="#${b.f.id}">${b.msg}</a></li>`).join("") +
        "</ul>";
      summary.hidden = false;
      summary.focus();
      return;
    }
    summary.hidden = true;
    const d = new FormData(form);
    const msg =
      `New enquiry from triptishetty.com%0A` +
      `Name: ${encodeURIComponent(d.get("name"))}%0A` +
      `Phone: ${encodeURIComponent(d.get("phone"))}%0A` +
      `Email: ${encodeURIComponent(d.get("email") || "-")}%0A` +
      `Matter: ${encodeURIComponent(d.get("matter"))}%0A%0A` +
      encodeURIComponent(d.get("message"));
    window.open(`https://wa.me/919820629737?text=${msg}`, "_blank");
    $("#formNote").hidden = false;
    form.reset();
  });
}

document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && !img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = "assets/profile.jpg";
    }
  },
  true
);
