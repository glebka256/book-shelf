<script setup lang="ts">
import { ref } from 'vue';
import auth from "@/config/auth";
import AuthForm from '@/component-lib/layout/AuthForm.vue';
import { AuthField } from "@/component-lib/layout/authForm.types";

const registerFields: AuthField[] = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
  { name: 'pass-match', label: 'Repeat password', type: 'password', placeholder: 'Repeat your password' }
];

/** message can either be error or successfull action status message */
const message = ref<string>('');

async function handleRegister(formData: Record<string, string>) {
  const response = await auth.service.register(formData)
  message.value = response.message;
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