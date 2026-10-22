// Inshify Studio — small progressive enhancements. Content works without JavaScript.
(function () {
  "use strict";
  var doc = document.documentElement;

  // ----- Theme toggle -----
  var themeBtn = document.querySelector(".theme-toggle");
  function syncThemeLabel() {
    if (!themeBtn) return;
    var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " mode");
  }
  if (themeBtn) {
    syncThemeLabel();
    themeBtn.addEventListener("click", function () {
      var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
      doc.setAttribute("data-theme", next);
      // Each site version can keep its own saved theme (data-theme-key on <html>).
      try { localStorage.setItem(doc.getAttribute("data-theme-key") || "theme", next); } catch (e) {}
      syncThemeLabel();
    });
  }

  // ----- Opening intro: take the cover screen out of the page once it has slid away -----
  if (doc.classList.contains("intro")) {
    setTimeout(function () { doc.classList.add("intro-gone"); }, 2400);
  }

  // ----- Header border once the page scrolls -----
  function onScroll() { doc.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ----- Mobile menu -----
  var menuBtn = document.querySelector(".menu-toggle");
  var menu = document.getElementById("nav-menu");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  // ----- Work filter -----
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll("#work-grid .card");
  var status = document.getElementById("filter-status");
  chips.forEach(function (chip) {
    var key = chip.getAttribute("data-filter");
    var n = Array.prototype.filter.call(cards, function (card) {
      return key === "all" || card.getAttribute("data-tags").split(" ").indexOf(key) > -1;
    }).length;
    var badge = chip.querySelector(".chip-n");
    if (badge) badge.textContent = n;
  });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.getAttribute("data-filter");
      var shown = 0;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      cards.forEach(function (card) {
        var match = key === "all" || card.getAttribute("data-tags").split(" ").indexOf(key) > -1;
        card.hidden = !match;
        if (match) shown++;
      });
      if (status) status.textContent = shown + (shown === 1 ? " project" : " projects") + " shown";
    });
  });

  // ----- Chat: Voiceflow if loaded, otherwise the fallback panel -----
  var panel = document.getElementById("chat-panel");
  var fab = document.querySelector(".chat-fab");
  function vfChat() { return window.voiceflow && window.voiceflow.chat; }
  function setPanel(open) {
    if (!panel) return;
    panel.hidden = !open;
    if (fab) fab.setAttribute("aria-expanded", String(open));
    if (open) panel.querySelector(".chat-close").focus();
    else if (fab) fab.focus();
  }
  function openChat() {
    var vf = vfChat();
    if (vf && typeof vf.open === "function") { vf.open(); return; }
    setPanel(panel ? panel.hidden : false);
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-chat]")) { e.preventDefault(); openChat(); }
  });
  if (panel) {
    panel.querySelector(".chat-close").addEventListener("click", function () { setPanel(false); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") setPanel(false); });
  }
  // Once the Voiceflow snippet has loaded, its own launcher takes over and ours is hidden.
  var tries = 0;
  var poll = setInterval(function () {
    if (vfChat() && typeof vfChat().open === "function") { doc.classList.add("vf-ready"); clearInterval(poll); }
    else if (++tries > 40) clearInterval(poll);
  }, 500);

  // ----- Scroll reveal: only for content that starts below the fold -----
  var motionOK = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (motionOK && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".section-head, .eyebrow + h2, .grid > *, .feat-grid > *, .steps > .step, .about > *, .cta-band, .credits, .chips, .case-brief, .g-row, .next-project, [data-reveal]"
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      // Stagger siblings in the same row of a grid.
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      if (el.parentNode.matches(".grid, .steps")) el.style.setProperty("--d", (i % 5) * 0.07 + "s");
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  // ----- Lightbox on project pages -----
  var box = document.querySelector(".lightbox");
  var shots = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (box && shots.length && typeof box.showModal === "function") {
    var img = box.querySelector("img");
    var idx = 0;
    var multi = shots.length > 1;
    box.querySelector(".lb-prev").hidden = !multi;
    box.querySelector(".lb-next").hidden = !multi;
    function show(i) {
      idx = (i + shots.length) % shots.length;
      img.src = shots[idx].getAttribute("href");
      img.alt = shots[idx].querySelector("img").alt;
    }
    shots.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); show(i); box.showModal(); });
    });
    box.querySelector(".lb-close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (!multi) return;
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    box.addEventListener("close", function () { shots[idx].focus(); });
  }
})();
