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
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input, textarea", form).forEach((f) => {
      if (f.required && !f.value.trim()) {
        f.classList.add("is-invalid");
        ok = false;
      } else if (f.type === "email" && f.value && !/^\S+@\S+\.\S+$/.test(f.value)) {
        f.classList.add("is-invalid");
        ok = false;
      } else {
        f.classList.remove("is-invalid");
      }
    });
    if (!ok) return;
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
