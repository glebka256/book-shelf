<script setup lang="ts">
import { ref } from 'vue';
import baseInstance from '@/api/baseInstance';
import { useFavoritesStore } from '@/store';
import AuthForm from '@/components/layout/AuthForm.vue';
import { FormField } from '@/types/Auth';
import { getResponseErrorMessage } from '@/utils';

const displayMessage = ref<boolean>(false);
const message = ref<string>('');

const loginFields: FormField[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
];

async function handleLogin(formData: Record<string, string>) {
  await login(formData);
  const favoritesStore = useFavoritesStore();
  favoritesStore.initialize();
}

interface LoginQuery {
  email: string,
  password: string
}

async function login(formData: Record<string, string>) {
  // Message keeps track of login execution state. No message means OK
  message.value = '';
  
  const query: LoginQuery = {
    email: formData.email,
    password: formData.password
  }

  try {
    const response = await baseInstance.post('auth/login', query);

    displayMessage.value = true;
    if (!response.data) {
      message.value = 'Could not connect to server.'
    } else {
      message.value = `Logged in with email: ${query.email}`;
    }
  } catch (error: unknown) {
    displayMessage.value = true;
    message.value = getResponseErrorMessage(error);
  }
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
    <router-link to="/register">Don't have an account? Register</router-link>
  </AuthForm>
  <div v-if="displayMessage" class="error">{{ message }}</div>
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
