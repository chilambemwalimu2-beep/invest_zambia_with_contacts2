document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const menu = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  const top = document.querySelector(".back-top");

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", scrollY > 20);
    top?.classList.toggle("show", scrollY > 500);
  });

  menu?.addEventListener("click", () => links?.classList.toggle("open"));
  links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  top?.addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        if(entry.target.dataset.count){
          const target = Number(entry.target.dataset.count);
          let n = 0, step = Math.max(1, Math.ceil(target/45));
          const tick = () => {
            n = Math.min(target, n + step);
            entry.target.textContent = n.toLocaleString();
            if(n < target) requestAnimationFrame(tick);
          };
          tick();
        }
      }
    });
  }, {threshold:.15});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const value = btn.dataset.filter;
      document.querySelectorAll("[data-sector]").forEach(card => {
        card.classList.toggle("hidden-card", value !== "all" && card.dataset.sector !== value);
      });
    });
  });

  const search = document.querySelector("#sectorSearch");
  search?.addEventListener("input", e => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll("[data-search]").forEach(item => {
      item.classList.toggle("hidden-card", q && !item.dataset.search.toLowerCase().includes(q));
    });
  });

  const calc = document.querySelector("#roiCalculator");
  calc?.addEventListener("submit", e => {
    e.preventDefault();
    const capital = Number(document.querySelector("#capital").value) || 0;
    const rate = Number(document.querySelector("#rate").value) || 0;
    const years = Number(document.querySelector("#years").value) || 1;
    const future = capital * Math.pow(1 + rate/100, years);
    const profit = future - capital;
    document.querySelector("#roiResult").innerHTML =
      `<strong>Illustrative value after ${years} year(s):</strong> $${future.toLocaleString(undefined,{maximumFractionDigits:0})}
       <br><span>Estimated gain: $${profit.toLocaleString(undefined,{maximumFractionDigits:0})}</span>`;
  });

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
