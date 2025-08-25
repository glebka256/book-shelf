<script setup lang="ts">
import { ref } from 'vue';
import WelcomeModal from '@/views/landing-modal/WelcomeModal.vue';

const showWelcome = ref(true);
</script>

<template>
 <div class="">
  <h1>This is AboutView Component</h1>
  <WelcomeModal :show-modal="showWelcome" @close="showWelcome = false" />
</div>
</template>

<style scoped lang="scss">

</style>