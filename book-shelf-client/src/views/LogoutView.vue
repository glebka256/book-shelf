<script setup lang="ts">
import { ref } from 'vue';
import baseInstance from '@/api/baseInstance';
import AuthForm from '@/components/layout/AuthForm.vue';
import { FormField } from '@/types/Auth';

const displayMessage = ref<boolean>(false);
const message = ref<string>('');

const logoutFields: FormField[] = [];

function handleLogout(formData: Record<string, string>) {
  logout(formData);
}

async function logout(formData: Record<string, string>) {
  try {
    const response = await baseInstance.post('auth/logout');

    displayMessage.value = true;
    message.value = `Logged out from account`;
  } catch (error: any) {
    displayMessage.value = true;
    message.value = 'Could not connect to the server.';
  }
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
    <router-link to="/register">Want to create a new account? Register</router-link>
  </AuthForm>
  <div v-if="displayMessage" class="error">{{ message }}</div>
 </div>
</template>

<style scoped lang="scss">
.logout-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  font-family: 'Arial', sans-serif;
}
</style>