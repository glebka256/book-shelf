<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from '@/config/auth';
import { User } from '@book-shelf/auth-util/src/auth.types';
import ActionButton from '@/component-lib/buttons/ActionButton.vue';

const user = ref<User>();
const errorMessage = ref<string>();
const router = useRouter();

const handleLogout = async () => {
  const logoutConfirmed = confirm("Are you sure you want to exit from account?");
  if (logoutConfirmed) {
    const result = await auth.api.requestLogout();
    if (result.status) {
      alert("Successfully loged out from account");
      router.push('/');
    } else {
      alert(result.message);
      errorMessage.value = result.message;
    }
  }
}

const handleDelete = async () => {
  const deleteConfirmed = confirm("Are you sure you want to delete this account?");
  if (deleteConfirmed) {
    const result = await auth.api.requestDelete();
    if (result.status) {
      alert("Account deleted");
      auth.api.requestLogout();
      router.push('/');
    } else {
      alert(result.message);
      errorMessage.value = result.message;
    }
  }
}

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
@import '@/styles/auth.scss';
@import "@/styles/variables.scss";

.profile-manager {
  @extend %auth-base;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.credentials, .not-signed-in, .error {
  background: $main-darker-bgcolor;
  padding: 20px;
  border-radius: 8px;
  box-shadow: $light-shadow;
  text-align: center;
}

.credentials p, .not-signed-in p, .error p {
  margin: 10px 0;
}

.error {
  color: $error-color;
}
</style>