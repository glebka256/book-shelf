<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { User } from '@/types/Auth';
import auth from '@/config/auth';

const user = ref<User>();
const errorMessage = ref<string>();

onMounted(async () => {
  const response = await auth.api.getUserCredentials();

  if (!('error' in response)) {
    user.value = response;
    errorMessage.value = undefined;

    // Suggest unauthorized users to sign in instead of showing the error.
  } else if (response.error !== 'Unauthorized') {
    errorMessage.value = response.error;
  }
});
</script>

<template>
  <div class="account-view">
   <h2>Account Information</h2>
   <div v-if="user" class="credentials">
     <p><strong>Username:</strong> {{ user.username }}</p>
     <p><strong>Email:</strong> {{ user.email }}</p>
   </div>
   <div v-else-if="errorMessage" class="error">
     <p>{{ errorMessage }}</p>
   </div>
   <div v-else class="not-signed-in">
     <p>You are not signed in. <router-link to="/auth/login">Sign in</router-link></p>
     <p>Do not have an account? <router-link to="/auth/register">Register</router-link></p>
   </div>
  </div>
</template>

<style scoped lang="scss">
.account-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  font-family: 'Arial', sans-serif;
}

.credentials, .not-signed-in, .error {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.credentials p, .not-signed-in p, .error p {
  margin: 10px 0;
}

.error {
  color: red;
}
</style>
