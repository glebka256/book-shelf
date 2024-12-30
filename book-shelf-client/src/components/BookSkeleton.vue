<script setup lang="ts">
import { computed, defineProps, PropType, ref, onMounted, watchEffect, onBeforeUnmount } from 'vue';

const props = defineProps({
  skeletonType: {
    type: String as PropType<'horizontal' | 'vertical'>,
    required: true
  },
  number_of_cards: {
    type: Number,
    required: false
  }
});

const isHorizontal = computed(() => {
  return props.skeletonType === 'horizontal' ? true : false;
});
const cardCount = ref(props.number_of_cards ?? 0);

function calculateCardCount() {
  const screenWidth = window.innerWidth;
  const skeletonCardSize = 250;

  if (props.skeletonType === 'horizontal') {
    cardCount.value = Math.floor(screenWidth / skeletonCardSize);
  }
  else {
    cardCount.value = Math.floor(screenWidth / skeletonCardSize) * 2;
  }
}

onMounted(() => {
  if (!props.number_of_cards) {
    calculateCardCount();
    window.addEventListener('resize', calculateCardCount);
  }
});

watchEffect(() => {
  if (props.number_of_cards) {
    cardCount.value = props.number_of_cards;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateCardCount);
});
</script>

<template>
  <div v-if="isHorizontal" class="book-sceleton">
    <div class="skeleton-horizontall-scroll">
      <div class=skeleton-cards>
        <div v-for="n in cardCount" :key="n" class="skeleton-card"></div>
      </div>
    </div>
  </div>
  <div v-else class="book-sceleton">
    <div class="skeleton-grid">
      <div v-for="n in cardCount" :key="n" class="skeleton-box"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-cards {
  display: flex;
  gap: 15px;
}

.skeleton-card {
  flex: 1;
  height: 250px;
  background: #e0e0e0;
  border-radius: 10px;
  animation: shimmer 1.5s infinite;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.skeleton-box {
  height: 250px;
  background: #e0e0e0;
  border-radius: 10px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}
</style>
