<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref, onMounted } from 'vue';
import type { LandingFeature } from './components/FeaturesSection.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import ModalHeader from './components/ModalHeader.vue';

const props = withDefaults(defineProps<{
  showModal?: boolean;
}>(), {
  showModal: false
});

const emit = defineEmits<{
  close: [];
}>();

const isVisible = ref(props.showModal);

const features: LandingFeature[] = [
  {
    id: 1,
    title: "Organize Your Library",
    description: "Keep track of all your books with our intuitive organization system. Sort by genre, author, or reading status."
  },
  {
    id: 2,
    title: "Track Reading Progress",
    description: "Monitor your reading journey with progress tracking, reading goals, and detailed statistics."
  },
  {
    id: 3,
    title: "Discover New Books",
    description: "Get personalized recommendations based on your reading history and preferences."
  },
  {
    id: 4,
    title: "Share & Connect",
    description: "Connect with fellow readers, share reviews, and discover what others are reading."
  }
];

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

const handleOverlayClick = () => {
  closeModal();
};

onMounted(() => {
  isVisible.value = props.showModal;
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <div class="glass-overlay"></div>
        <div class="modal-content">
          <!-- Close button -->
          <button class="close-btn" @click="closeModal" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <ModalHeader title="Welcome to Book Shelf"/>

          <!-- Feature bullet points -->
          <FeaturesSection :features="features"/>

          <!-- Continue button -->
          <div class="action-section">
            <button class="continue-btn" @click="closeModal">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  position: relative;
  background: rgba(121, 181, 255, 0.56);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 2px 16px rgba(255, 255, 255, 0.15) inset,
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  // Animated gradient background
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(103, 126, 234, 0.1) 0%,
      rgba(118, 75, 162, 0.1) 50%,
      rgba(103, 126, 234, 0.05) 100%
    );
    opacity: 0.7;
    animation: gradientShift 8s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.15) 100%
    );
    pointer-events: none;
  }
}

.modal-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem 2rem;
  overflow-y: auto;
  max-height: 90vh;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(16, 18, 61, 0.8);
  transition: all 0.2s ease;
  z-index: 3;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.action-section {
  text-align: center;

  .continue-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 12px;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(103, 126, 234, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.6);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@media (max-width: $small-width) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }

  .modal-content {
    padding: 2rem 1.5rem;
  }
}
</style>