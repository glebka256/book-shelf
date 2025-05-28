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
    defalt: undefined
  }
});
</script>

<template>
  <header class="header">
    <div class="header-content">
      <LogoImage :width="150" />
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
  background: $main-darker-bgcolor;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border-bottom: 1px solid $sec-thick-font;
  padding: 2rem 0;
  text-align: center;
  box-shadow: $wide-shadow;

  .header-content {
    max-width: $manager-content-mxwidth;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 1rem 0 0.5rem 0;
    background: linear-gradient(135deg, $initial-gradient-bg-color, $transition-gradient-bg-color);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 1.1rem;
    color: $sec-thick-font;
    margin: 0;
  }
}
</style>