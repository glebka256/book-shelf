<script setup lang="ts">
import { ref } from 'vue';
import { useFavoritesStore } from '@/store/favoritesStore';
import AuthForm from '@/components/layout/AuthForm.vue';
import { FormField } from '@/types/Auth';
import { sendInteractions } from '@/services/interactionService';
import auth from '@/config/auth';

const loginFields: FormField[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
];

const message = ref<string>('');

async function handleLogin(formData: Record<string, string>) {
  const response = await auth.service.login(formData);
  message.value = response.message;

  const favoritesStore = useFavoritesStore();
  await favoritesStore.initialize();

  sendInteractions();
}
</script>

<template>
 <div class="login-view">
  <AuthForm
    title="Login"
    :fields="loginFields"
    submit-text="Sign in"
    @submit="handleLogin"
  >
    <router-link to="/auth/register">Don't have an account? Register</router-link>
  </AuthForm>
  <div v-if="message" class="error">{{ message }}</div>
 </div>
</template>

<style scoped lang="scss">
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  font-family: 'Arial', sans-serif;
}
</style>
