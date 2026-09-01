---
layout: layout.njk
title: Home
pageStyles: /css/home.css
---

# Darpan Choudhary
<img src="/images/cat-hb.webp" width="100%" height="250" alt="Cat banner" fetchpriority="high" decoding="async"/>

<section class="meowl-pet" aria-labelledby="meowl-pet-title">
  <div class="meowl-pet__intro">
    <h2 id="meowl-pet-title">Pet Meowl</h2>
    <p>Press and hold the button to give Meowl a few pets.</p>
  </div>

  <div class="meowl-pet__stage">
    <img
      id="meowl-image"
      class="meowl-pet__image"
      src="/images/meowl-rest.webp"
      data-rest-src="/images/meowl-rest.webp"
      data-petting-src="/images/meowl-petting.webp"
      width="156"
      height="156"
      alt="Meowl perched on a branch"
      decoding="async"
      draggable="false"
    />
    <button id="meowl-pet-button" class="meowl-pet__button" type="button" aria-describedby="meowl-pet-status">
      Hold to pet
    </button>
    <span id="meowl-pet-status" class="meowl-pet__status" aria-live="polite">Meowl is waiting for pets.</span>
  </div>
</section>

<script>
(() => {
  const image = document.getElementById("meowl-image");
  const button = document.getElementById("meowl-pet-button");
  const status = document.getElementById("meowl-pet-status");

  if (!image || !button || !status) return;

  const restSrc = image.dataset.restSrc;
  const pettingSrc = image.dataset.pettingSrc;
  let isPetting = false;
  let isPrimed = false;

  const primePettingImage = () => {
    if (isPrimed) return;
    isPrimed = true;
    const preload = new Image();
    preload.src = pettingSrc;
  };

  const startPetting = () => {
    if (isPetting) return;
    primePettingImage();
    isPetting = true;
    image.src = pettingSrc;
    image.alt = "Meowl being gently petted";
    button.classList.add("is-petting");
    button.setAttribute("aria-pressed", "true");
    status.textContent = "Meowl is being petted.";
  };

  const stopPetting = () => {
    if (!isPetting) return;
    isPetting = false;
    image.src = restSrc;
    image.alt = "Meowl perched on a branch";
    button.classList.remove("is-petting");
    button.setAttribute("aria-pressed", "false");
    status.textContent = "Meowl is waiting for pets.";
  };

  button.setAttribute("aria-pressed", "false");
  button.addEventListener("pointerenter", primePettingImage, { once: true });
  button.addEventListener("focus", primePettingImage, { once: true });
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    startPetting();
  });
  button.addEventListener("pointerup", stopPetting);
  button.addEventListener("pointercancel", stopPetting);
  button.addEventListener("lostpointercapture", stopPetting);
  button.addEventListener("keydown", (event) => {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      startPetting();
    }
  });
  button.addEventListener("keyup", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      stopPetting();
    }
  });
  button.addEventListener("blur", stopPetting);
  window.addEventListener("pointerup", stopPetting);
  window.addEventListener("blur", stopPetting);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPetting();
  });

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(primePettingImage, { timeout: 2500 });
  } else {
    window.setTimeout(primePettingImage, 1500);
  }
})();
</script>
