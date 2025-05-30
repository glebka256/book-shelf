<script setup lang="ts">
import { defineProps } from 'vue';
import LogoImage from '@/component-lib/common/LogoImage.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: false,
    default: undefined
  }
});
</script>

<template>
  <header class="header">
    <div class="glass-overlay"></div>
    <div class="header-content">
      <div class="logo-container">
        <LogoImage :width="150" />
      </div>
      <div class="header-text">
        <h1 class="title">{{ props.title }}</h1>
        <p v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.header {
  position: relative;
  background: rgba(121, 181, 255, 0.18);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 3rem 0;
  text-align: center;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 2px 16px rgba(255, 255, 255, 0.15) inset,
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  margin-bottom: 2rem;
  overflow: hidden;
  
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

  .header-content {
    position: relative;
    z-index: 2;
    max-width: $manager-content-mxwidth;
    margin: 0 auto;
    padding: 0 2rem;
    
    .logo-container {
      margin-bottom: 1.5rem;
    }
  }

  .title {
    font-size: 3rem;
    font-weight: 800;
    margin: 1rem 0 0.5rem 0;
    background: linear-gradient(
      135deg, 
      #667eea 0%,
      #764ba2 50%,
      #667eea 100%
    );
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientText 4s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(103, 126, 234, 0.3);
    letter-spacing: -0.02em;
    
    @media (max-width: $small-width) {
      font-size: 2.2rem;
    }
  }

  .subtitle {
    font-size: 1.2rem;
    color: rgba(16, 18, 61, 0.9);
    margin: 0;
    font-weight: 500;
    opacity: 0.8;
    animation: fadeInUp 1s ease-out 0.3s both;
  }

  // Hover effects
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.2),
      0 4px 20px rgba(255, 255, 255, 0.15) inset,
      0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  }

  // Transition for smooth hover
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// Keyframe animations
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes gradientText {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 0.8;
    transform: translateY(0);
  }
}

// Responsive adjustments
@media (max-width: $small-width) {
  .header {
    padding: 2rem 0;
    margin: 1rem;
    border-radius: 20px;
  }
}
</style>