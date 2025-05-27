<script setup lang="ts">
import { ref } from 'vue';
import auth from "@/config/auth";
import AuthForm from '@/component-lib/layout/AuthForm.vue';
import { AuthField } from "@/component-lib/layout/authForm.types";
import { useRoute, useRouter } from 'vue-router';

const loginFields: AuthField[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
];

/** message can either be error or successfull action status message */
const message = ref<string>('');

const router = useRouter();
const route = useRoute();

async function handleLogin(formData: Record<string, string>) {
  const result = await auth.service.login(formData);
  message.value = result.message;

  if (result.status) {
    const redirectPath = (route.query.redirect as string) || '/';
    router.push(redirectPath);
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
    <router-link to="/auth/register">Don't have an account? Register</router-link>
  </AuthForm>
  <div v-if="message" class="error">{{ message }}</div>
 </div>
</template>

<style scoped lang="scss">
@import '@/styles/auth.scss';

.login-view {
  @extend %auth-base;
}
</style>