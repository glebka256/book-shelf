<script setup lang="ts">
import { ref } from 'vue';
import AuthForm from '@/components/layout/AuthForm.vue';
import { AuthField } from '@/components/layout/authForm.types.ts';

const registerFields: AuthField[] = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
  { name: 'pass-match', label: 'Repeat password', type: 'password', placeholder: 'Repeat your password' }
];

const message = ref<string>('');

async function handleRegister(formData: Record<string, string>) {
  console.log("register");
}
</script>

<template>
 <div class="register-view">
  <AuthForm
    title="Register"
    :fields="registerFields"
    submit-text="Register"
    @submit="handleRegister"
  >
    <router-link to="/auth/login">Already registered? Sign in</router-link>
  </AuthForm>
  <div v-if="message" class="error">{{ message }}</div>
 </div>
</template>

<style scoped lang="scss">
.register-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  font-family: 'Arial', sans-serif;
}
</style>
