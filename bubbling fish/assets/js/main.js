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

  // sticky header: transparent over the hero, solid once past it
  const header = $(".site-header");
  const hero = $(".hero");
  const onScroll = () => {
    if (!header) return;
    const limit = hero ? hero.offsetHeight - header.offsetHeight : 8;
    header.classList.toggle("is-scrolled", scrollY > limit);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  onScroll();

  // hero video: desktop only — mobile keeps the poster (data, battery, LCP)
  const hv = $(".hero-video");
  if (hv && innerWidth >= 768 && !matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator.connection && navigator.connection.saveData)) {
    hv.src = hv.dataset.src;
    hv.play().catch(() => {});
  }

  // reveal on scroll — each element gets a random entrance effect
  const FX = ["", "fx-left", "fx-right", "fx-zoom", "fx-blur", "fx-tilt"];
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { threshold: 0.12 }
  );
  $$("[data-reveal]").forEach((el) => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const fx = FX[Math.floor(Math.random() * FX.length)];
      if (fx) el.classList.add(fx);
    }
    io.observe(el);
  });

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

  // scroll-progress water line
  const line = document.createElement("div");
  line.className = "scroll-line";
  line.setAttribute("aria-hidden", "true");
  document.body.appendChild(line);
  const bar = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    line.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
  };
  addEventListener("scroll", bar, { passive: true });
  addEventListener("resize", bar, { passive: true });
  bar();

  // ambient bubble canvas — floating motes behind content
  const canvas = document.createElement("canvas");
  canvas.className = "bubble-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, motes, raf;
    const fit = () => {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
      const n = Math.round(Math.min(48, (w * h) / 34000));
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.5 + Math.random() * 5.5,
        s: 0.15 + Math.random() * 0.5,
        d: Math.random() * Math.PI * 2,
        o: 0.12 + Math.random() * 0.35,
      }));
    };
    const draw = () => {
      if (document.hidden) { raf = null; return; }
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.s;
        m.d += 0.008;
        m.x += Math.sin(m.d) * 0.3;
        if (m.y < -12) { m.y = h + 12; m.x = Math.random() * w; }
        const g = ctx.createRadialGradient(m.x - m.r / 3, m.y - m.r / 3, 0, m.x, m.y, m.r);
        g.addColorStop(0, `rgba(255,255,255,${m.o})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    fit();
    draw();
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !raf) draw(); });
    addEventListener("resize", () => { cancelAnimationFrame(raf); raf = null; fit(); draw(); }, { passive: true });
  }
})();
