// File: Main/ui/artifact/artifact-modular-window/artifact-modular-window.js
// Main/ui/artifact/artifact-modular-window/artifact-modular-window.js

export function initInertialScroll(cardElement) {
  const inner = cardElement.querySelector(".artifact-card__inner");
  const scrollContent = inner.querySelector(".artifact-card__scroll");

  let offset = 0;
  let isPointerDown = false;
  let lastPointerY = 0;
  let animationFrameId = null;

  const maxOverscroll = 450;
  const ease = 0.1;

  function getBounds() {
    const innerHeight = inner.clientHeight;
    const contentHeight = scrollContent.scrollHeight;
    const maxScroll = Math.max(contentHeight - innerHeight, 0);
    return { maxScroll };
  }

  function setOffset(y) {
    offset = y;
    scrollContent.style.transform = `translateY(${offset}px)`;
  }

  function stopAnimation() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function animateBack() {
    stopAnimation();
    const { maxScroll } = getBounds();
    const minOffset = -maxScroll;

    let target = offset;
    if (offset > 0) target = 0;
    if (offset < minOffset) target = minOffset;

    function step() {
      const diff = target - offset;
      if (Math.abs(diff) < 0.5) {
        setOffset(target);
        animationFrameId = null;
        return;
      }
      setOffset(offset + diff * ease);
      animationFrameId = requestAnimationFrame(step);
    }

    if (target !== offset) {
      animationFrameId = requestAnimationFrame(step);
    }
  }

  function onWheel(e) {
    e.preventDefault();
    stopAnimation();

    const { maxScroll } = getBounds();
    const minOffset = -maxScroll;

    let newOffset = offset - e.deltaY;

    if (newOffset > maxOverscroll) newOffset = maxOverscroll;
    if (newOffset < minOffset - maxOverscroll)
      newOffset = minOffset - maxOverscroll;

    setOffset(newOffset);

    if (newOffset > 0 || newOffset < minOffset) {
      animateBack();
    }
  }

  function onPointerDown(e) {
    const target = e.target;
    if (
      target.closest(".artifact-card__lock") ||
      target.closest(".artifact-card__favorite")
    ) {
      return;
    }

    isPointerDown = true;
    lastPointerY = e.clientY;
    stopAnimation();
    inner.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isPointerDown) return;

    const dy = e.clientY - lastPointerY;
    lastPointerY = e.clientY;

    const { maxScroll } = getBounds();
    const minOffset = -maxScroll;

    let newOffset = offset + dy;

    if (newOffset > maxOverscroll) newOffset = maxOverscroll;
    if (newOffset < minOffset - maxOverscroll)
      newOffset = minOffset - maxOverscroll;

    setOffset(newOffset);
  }

  function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    inner.releasePointerCapture(e.pointerId);
    animateBack();
  }

  inner.addEventListener("wheel", onWheel, { passive: false });
  inner.addEventListener("pointerdown", onPointerDown);
  inner.addEventListener("pointermove", onPointerMove);
  inner.addEventListener("pointerup", onPointerUp);
  inner.addEventListener("pointercancel", onPointerUp);

  cardElement.scrollToTop = function () {
    stopAnimation();
    setOffset(0);
  };
}

export function updateCardOverflow(cardElement) {
  const HEADER_TOP_OFFSET = 24;
  const INNER_TARGET_HEIGHT = 864 - HEADER_TOP_OFFSET;

  const titleBar = cardElement.querySelector(".artifact-card__title-bar");
  const headerContent = cardElement.querySelector(
    ".artifact-card__header-content"
  );
  const body = cardElement.querySelector(".artifact-card__body");

  if (!titleBar || !headerContent || !body) {
    cardElement.classList.remove("artifact-card--overflow");
    return;
  }

  const totalContentHeight =
    titleBar.offsetHeight + headerContent.offsetHeight + body.offsetHeight;

  const diff = totalContentHeight - INNER_TARGET_HEIGHT;
  const shouldShow = diff >= -5;

  cardElement.classList.toggle("artifact-card--overflow", shouldShow);
}

function fitTitleToBox(element, options = {}) {
  const maxFontSize = options.maxFontSize || 32;
  const minFontSize = options.minFontSize || 18;
  const step = options.step || 1;
  const widthRatio = options.widthRatio || 0.98;
  const heightRatio = options.heightRatio || 0.98;

  element.style.fontSize = maxFontSize + "px";

  const parent = element.parentElement;
  const style = getComputedStyle(parent);

  const maxWidth = parent.clientWidth;
  const safeWidth = maxWidth * widthRatio;

  const parentHeight = parent.clientHeight;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;
  const innerHeight = parentHeight - paddingTop - paddingBottom;
  const safeHeight = innerHeight * heightRatio;

  let currentSize = maxFontSize;
  let fits = false;

  while (currentSize >= minFontSize) {
    element.style.fontSize = currentSize + "px";

    const tooWide = element.scrollWidth > safeWidth;
    const tooTall = element.scrollHeight > safeHeight;

    if (!tooWide && !tooTall) {
      fits = true;
      break;
    }
    currentSize -= step;
  }

  if (!fits) {
    element.style.fontSize = minFontSize + "px";
  }
}

export function updateLockFavoriteUI(root, artifact) {
  const lockBtn = root.querySelector(".artifact-card__lock");
  const favBtn = root.querySelector(".artifact-card__favorite");

  lockBtn.classList.toggle("artifact-card__lock--active", artifact.isLocked);
  favBtn.classList.toggle(
    "artifact-card__favorite--active",
    artifact.isFavorited
  );
}

export function renderArtifactCard(root, artifact) {
  const titleBar = root.querySelector(".artifact-card__title-bar");
  const headerContent = root.querySelector(".artifact-card__header-content");

  const gradient = artifact.gradient;
  const titleColor = artifact.titleBarColor;

  if (gradient) headerContent.style.background = gradient;
  if (titleColor) {
    titleBar.style.backgroundColor = titleColor;
    titleBar.style.borderColor = titleColor;
    titleBar.style.boxShadow = "inset 0 0 0 3px rgba(0, 0, 0, 0.1)";
  }

  root.querySelector(".artifact-card__title").textContent = artifact.name;
  root.querySelector(".artifact-card__slot").textContent = artifact.slotLabel;

  const mainLabel = root.querySelector(".artifact-card__main-stat-label");
  const mainValue = root.querySelector(".artifact-card__main-stat-value");
  mainLabel.textContent = artifact.mainStatLabel;
  mainValue.textContent = artifact.mainStatValue;

  root.querySelector(".artifact-card__slot").style.opacity = 0.946;
  mainValue.style.opacity = 0.946;

  const iconImg = root.querySelector(".artifact-card__icon-image");
  iconImg.src = artifact.iconUrl;
  iconImg.draggable = false;

  const starsContainer = root.querySelector(".artifact-card__stars");
  starsContainer.innerHTML = "";
  for (let i = 0; i < artifact.rarity; i++) {
    const span = document.createElement("span");
    span.className = "artifact-card__star";
    starsContainer.appendChild(span);
  }

  root.querySelector(".artifact-card__level").textContent =
    "+" + artifact.level;

  const substatsList = root.querySelector(".artifact-card__substats");
  substatsList.innerHTML = "";
  artifact.substats.forEach((s) => {
    const li = document.createElement("li");
    const val = s.displayValue !== undefined ? s.displayValue : s.value;
    li.textContent = `${s.label} ${val}`;
    substatsList.appendChild(li);
  });

  const setSection = root.querySelector(".artifact-card__set-section");
  const setTitle = root.querySelector(".artifact-card__set-title");
  const bonusContainer = root.querySelector(".artifact-card__set-bonus");

  if (
    !artifact.setName ||
    !artifact.setBonuses ||
    artifact.setBonuses.length === 0
  ) {
    setSection.style.display = "none";
  } else {
    setSection.style.display = "";
    setTitle.textContent = artifact.setName + ":";
    bonusContainer.innerHTML = "";
    artifact.setBonuses.forEach((b) => {
      const p = document.createElement("p");
      p.className = "artifact-card__set-line";
      p.textContent = `${b.pieces} предмет(а): ${b.description}`;
      bonusContainer.appendChild(p);
    });
  }

  root.querySelector(".artifact-card__description").textContent =
    artifact.description || "";

  updateLockFavoriteUI(root, artifact);
  fitTitleToBox(root.querySelector(".artifact-card__title"), {
    maxFontSize: 32,
    minFontSize: 18,
    step: 1,
    widthRatio: 0.98,
    heightRatio: 0.98,
  });

  const cardElement = root.closest(".artifact-card");
  if (typeof cardElement.scrollToTop === "function") {
    cardElement.scrollToTop();
  }
  updateCardOverflow(cardElement);
}
