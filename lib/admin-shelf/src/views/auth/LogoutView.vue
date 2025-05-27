<script setup lang="ts">
import { ref } from 'vue';
import auth from "@/config/auth";
import AuthForm from '@/component-lib/layout/AuthForm.vue';
import { AuthField } from "@/component-lib/layout/authForm.types";

const logoutFields: AuthField[] = [];

/** message can either be error or successfull action status message */
const message = ref<string>('');

async function handleLogout() {
  const response = await auth.service.logout();
  message.value = response.message;
}
</script>

<template>
 <div class="logout-view">
  <AuthForm
    title="Exit you account"
    :fields="logoutFields"
    submit-text="Logout"
    @submit="handleLogout"
  >
    <router-link to="/auth/register">Want to create a new account? Register</router-link>
  </AuthForm>
  <div v-if="message" class="error">{{ message }}</div>
 </div>
</template>

<style scoped lang="scss">
@import '@/styles/auth.scss';

.logout-view {
  @extend %auth-base;
}
</style>