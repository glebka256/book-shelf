<script setup lang="ts">
import AuthForm from '@/components/AuthForm.vue';
import { FormField } from '@/types/Auth';

const registerFields: FormField[] = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
  { name: 'pass-match', label: 'Repeat password', type: 'password', placeholder: 'Repeat your password' }
];

function handleRegister(formData: Record<string, string>) {
  console.log('registering...');
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
    <router-link to="/login">Already registered? Sign in</router-link>
  </AuthForm>
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