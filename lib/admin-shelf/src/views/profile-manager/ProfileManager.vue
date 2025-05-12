<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth } from '@book-shelf/auth-util';
import { User } from '@book-shelf/auth-util/src/auth.types';
import baseInstance from '@/config/axios';
import ActionButton from '@/../../component-lib/src/components/buttons/ActionButton.vue';

const user = ref<User>();
const errorMessage = ref<string>();

const handleLogout = () => {
  console.log("log out");
}

const handleDelete = () => {
  console.log("delete");
}

onMounted(async () => {
  const auth = useAuth(baseInstance);
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
  <div class="profile-manager">
   <h2>Account Information</h2>
   <div v-if="user" class="credentials">
     <p><strong>Username:</strong> {{ user.username }}</p>
     <p><strong>Email:</strong> {{ user.email }}</p>

     <div class="button-group">
      <ActionButton type="button" text="Logout" class="btn-secondary" @click="handleLogout" />
      <ActionButton type="button" text="Delete Account" class="btn-danger" @click="handleDelete" />
     </div>
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
.profile-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  font-family: 'Arial', sans-serif;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
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