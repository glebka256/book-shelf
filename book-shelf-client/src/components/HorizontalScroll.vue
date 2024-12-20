<script setup lang="ts">
import BookCard from './BookCard.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const scrollView = ref<HTMLElement>();
const isScrolling = ref<boolean>(false);

const updateGap = () => {
  if (scrollView.value) {
    const containerWidth = scrollView.value.clientWidth;
    const cardWidth = scrollView.value.firstElementChild?.clientWidth || 0;

    const visibleCards = Math.floor(containerWidth / cardWidth);
    const remainingSpace = containerWidth - visibleCards * cardWidth;
    const newGap = Math.max(remainingSpace / (visibleCards - 1), 0);

    scrollView.value.style.gap = `${newGap}px`;
  }
};

const scroll = (direction: 'left' | 'right') => {
  if (!scrollView.value || isScrolling.value) return;

  isScrolling.value = true;

  const cardWidth = scrollView.value.firstElementChild?.clientWidth || 0;
  const gap = parseInt(getComputedStyle(scrollView.value).gap || "0");
  const distance = cardWidth + gap;

  scrollView.value.scrollBy({
    left: direction === 'left' ? -distance : distance,
    behavior: "smooth",
  });

  setTimeout(() => {
    isScrolling.value = false;
  }, 300);
}

onMounted(() => {
  window.addEventListener('resize', updateGap);
  updateGap();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGap);
});
</script>

<template>
 <div class="scroll-container">
  <button class="scroll-button left" @click="scroll('left')"><i class="fa-solid fa-chevron-left"></i></button>
  <button class="scroll-button right" @click="scroll('right')"><i class="fa-solid fa-chevron-right"></i></button>
  <div class="scroll-view-wrapper">
    <div class="scroll-view" ref="scrollView">
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
      <book-card />
    </div>
  </div>
 </div>
</template>

<style scoped lang="scss">
.scroll-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: visible;
}

.scroll-view-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.scroll-view {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 20px;
  transition: scroll-behavior 0.3s ease-in-out;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 72px;
  height: 72px;
  color: #7175d1;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 10;

  i {
    transform: scale(2, 3);
  }
}

.scroll-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.scroll-button.left {
  left: -42px;
}

.scroll-button.right {
  right: -42px;
}

.scroll-button:hover {
  background-color: #5c60c0;
  color: rgb(156, 177, 240);
  transform: translateY(-50%) scale(1.1);
}
</style>
