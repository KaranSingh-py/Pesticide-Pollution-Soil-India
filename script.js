(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Mobile contents menu
  var toc = $("#toc"), btn = $("#menuBtn");
  btn.addEventListener("click", function () { toc.classList.toggle("open"); });
  $$("#toc a").forEach(function (a) {
    a.addEventListener("click", function () { toc.classList.remove("open"); });
  });

  // Scroll spy
  var sections = $$("article section[id]");
  var links = {};
  $$("#toc a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          $$("#toc a.active").forEach(function (x) { x.classList.remove("active"); });
          if (links[e.target.id]) links[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { spy.observe(s); });

    // Animate charts when they scroll into view
    var charts = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); charts.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    $$(".chart").forEach(function (c) { charts.observe(c); });
  } else {
    $$(".chart").forEach(function (c) { c.classList.add("in"); });
  }

  // Back-to-top
  var top = $("#top");
  window.addEventListener("scroll", function () {
    top.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Simple page search: hides sections that do not contain the query
  var input = $("#q"), none = $("#noresult");
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase(), shown = 0;
    sections.forEach(function (s) {
      var ok = !q || s.textContent.toLowerCase().indexOf(q) !== -1;
      s.classList.toggle("hidden", !ok);
      if (links[s.id]) links[s.id].parentNode.classList.toggle("hidden", !ok);
      if (ok) shown++;
    });
    none.style.display = shown ? "none" : "block";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
  });

  $("#year").textContent = new Date().getFullYear();
})();
