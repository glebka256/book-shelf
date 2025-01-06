<script setup lang="ts">
import { ref } from 'vue';
import AuthForm from '@/components/AuthForm.vue';
import { FormField } from '@/types/Auth';
import baseInstance from '@/api/baseInstance';

const registerFields: FormField[] = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
  { name: 'pass-match', label: 'Repeat password', type: 'password', placeholder: 'Repeat your password' }
];

const OK_STATUS = 'ok'

const displayMessage = ref<boolean>(false);
const message = ref<string>();

function validateInput(formData: Record<string, string>): string {
  const errorMessage = OK_STATUS;

  const username = formData.username;
  if (!username) {
    return 'Username is required.';
  }

  if (username.length < 5 || username.length > 20) {
    return 'Username should be between 5 and 20 characters in length.';
  }

  const email = formData.email;
  if (!email) {
    return 'Email is required.'
  }

  if (!email.includes('@') || !email.includes('.')) {
    return 'Email must be valid.';
  }

  const password = formData.password;
  if (!password) {
    return 'Password is required.';
  } 

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }

  const passMatch = formData['pass-match'];
  if (passMatch !== password) {
    return 'Passwords do not match.';
  }

  return errorMessage;
}

function handleRegister(formData: Record<string, string>) {
  const validationMessage = validateInput(formData);

  if (validationMessage === OK_STATUS) {
    register(formData);
  } else {
    displayMessage.value = true;
    message.value = validationMessage;
  }
}

interface RegisterQuery {
  username: string,
  email: string,
  password: string
}

async function register(formData: Record<string, string>) {
  displayMessage.value = false;
  
  const query: RegisterQuery = {
    username: formData.username,
    email: formData.email,
    password: formData.password
  }
  
  try {
    const response = await baseInstance.post('auth/register', query);

    displayMessage.value = true;
    if (!response.data) {
      message.value = "Could not connect to server.";
    } else {
      message.value = `Registered with email: ${query.email}`;
    }
  } catch (error: any) {
    displayMessage.value = true;

    if (error.response && error.response.data) {
      const serverError = error.response.data;
      message.value = serverError.error || 'An error occured on the server.';
    } else {
      message.value = error.message || 'An unexpected error occured.';
    }
  }
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
  <div v-if="displayMessage" class="error">{{ message }}</div>
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