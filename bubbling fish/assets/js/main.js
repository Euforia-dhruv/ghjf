(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // mobile nav
  const toggle = $("#navToggle"), nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // sticky header shadow
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // hero video: desktop only — mobile keeps the poster (data, battery, LCP)
  const hv = $(".hero-video");
  if (hv && innerWidth >= 768 && !matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator.connection && navigator.connection.saveData)) {
    hv.src = hv.dataset.src;
    hv.play().catch(() => {});
  }

  // hero bubbles
  const box = $(".bubbles");
  if (box && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < 14; i++) {
      const b = document.createElement("i");
      const size = 8 + Math.random() * 30;
      b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${8 + Math.random() * 12}s;animation-delay:${-Math.random() * 15}s`;
      box.appendChild(b);
    }
  }

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { threshold: 0.12 }
  );
  $$("[data-reveal]").forEach((el) => io.observe(el));

  // counters
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  // testimonial slider
  const slides = $(".slides");
  if (slides) {
    const step = () => slides.querySelector(".slide")?.getBoundingClientRect().width + 22 || 400;
    $$("[data-slide]").forEach((btn) =>
      btn.addEventListener("click", () =>
        slides.scrollBy({ left: btn.dataset.slide === "next" ? step() : -step(), behavior: "smooth" })
      )
    );
  }

  // forms: client-side validation + success state
  $$("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((f) => {
        const input = f.querySelector("input, select, textarea");
        if (!input || !input.required) return;
        const bad = !input.value.trim() || (input.type === "email" && !/^\S+@\S+\.\S+$/.test(input.value)) ||
          (input.type === "tel" && !/^[+\d][\d\s-]{7,}$/.test(input.value));
        f.classList.toggle("is-invalid", bad);
        if (bad) { input.setAttribute("aria-invalid", "true"); ok = false; }
        else input.removeAttribute("aria-invalid");
      });
      if (ok) form.closest(".form-card")?.classList.add("is-sent");
      else form.querySelector('[aria-invalid="true"]')?.focus();
    });
    form.addEventListener("input", (e) => {
      e.target.closest(".field")?.classList.remove("is-invalid");
      e.target.removeAttribute?.("aria-invalid");
    });
  });

  // footer year
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
