const modal = document.getElementById("faq-modal");
const openBtn = document.querySelector(".help-btn");
const closeBtn = modal?.querySelector(".modal-close");
const overlay = modal?.querySelector(".modal-overlay");
const modalContent = modal?.querySelector(".modal-content");
const faqButtons = [...document.querySelectorAll(".faq-question")];
const stickyCta = document.getElementById("cta-stick");
const heroImage = document.querySelector(".hero-image");
const commentInput = document.querySelector(".comment-input");
const commentBox = document.querySelector(".comment-box");
const commentSubmit = document.querySelector(".comment-submit");
const loadMoreBtn = document.querySelector(".load-more-btn");
const extraComments = [...document.querySelectorAll(".comment--extra")];
let revealedComments = extraComments.filter(
  (comment) => !comment.classList.contains("comment--hidden")
).length;

const collapseAllFaqs = () => {
  faqButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.nextElementSibling?.setAttribute("hidden", "");
    const icon = button.querySelector(".faq-icon");
    if (icon) icon.textContent = "+";
  });
};

const toggleFaq = (button) => {
  const willOpen = button.getAttribute("aria-expanded") === "false";
  collapseAllFaqs();
  if (willOpen) {
    button.setAttribute("aria-expanded", "true");
    button.nextElementSibling?.removeAttribute("hidden");
    const icon = button.querySelector(".faq-icon");
    if (icon) icon.textContent = "×";
  }
};

const toggleModal = (show) => {
  if (!modal) return;
  const isOpen = show ?? modal.getAttribute("aria-hidden") === "true";
  modal.setAttribute("aria-hidden", (!isOpen).toString());
  document.body.classList.toggle("modal-open", isOpen);
  if (isOpen) collapseAllFaqs();
};

faqButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFaq(button);
  });
});

commentSubmit?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Comments are disabled by the author.");
});

commentInput?.addEventListener("focus", () => {
  commentBox?.classList.add("comment-box--expanded");
});

const updateLoadMoreState = () => {
  if (!loadMoreBtn) return;
  const remaining = extraComments.length - revealedComments;
  if (remaining <= 0) {
    loadMoreBtn.classList.add("is-hidden");
    loadMoreBtn.setAttribute("disabled", "true");
    loadMoreBtn.setAttribute("aria-hidden", "true");
    return;
  }

  const nextBatch = Math.min(5, remaining);
  const label = `Load ${nextBatch} more comment${nextBatch === 1 ? "" : "s"}`;
  loadMoreBtn.textContent = label;
};

const revealNextComments = () => {
  const remaining = extraComments.length - revealedComments;
  if (remaining <= 0) return;
  const batchSize = Math.min(5, remaining);
  for (let index = 0; index < batchSize; index += 1) {
    extraComments[revealedComments + index]?.classList.remove("comment--hidden");
  }
  revealedComments += batchSize;
  updateLoadMoreState();
};

loadMoreBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  revealNextComments();
});

updateLoadMoreState();

openBtn?.addEventListener("click", () => toggleModal(true));
closeBtn?.addEventListener("click", () => toggleModal(false));
overlay?.addEventListener("click", () => toggleModal(false));

modalContent?.addEventListener("click", (event) => {
  if (
    event.target.closest(".faq-question") ||
    event.target.closest(".faq-answer") ||
    event.target.closest(".modal-close")
  ) {
    return;
  }
  collapseAllFaqs();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") {
    toggleModal(false);
  }
});

if (stickyCta && heroImage) {
  const updateCtaPosition = () => {
    const heroBottom = heroImage.getBoundingClientRect().bottom;
    if (heroBottom <= 0) {
      stickyCta.classList.add("cta-fixed");
    } else {
      stickyCta.classList.remove("cta-fixed");
    }
  };

  window.addEventListener("scroll", updateCtaPosition, { passive: true });
  window.addEventListener("resize", updateCtaPosition);

  updateCtaPosition();
}
