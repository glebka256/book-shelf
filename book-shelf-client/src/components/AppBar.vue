<script setup lang="ts">
</script>

<template>
 <div class="app-bar">
  <nav>
    <ul>
      <h2 class="logo">Book Shelf</h2>
      <li><router-link to="/"><i class="fas fa-home"></i> <span class="router-link-text">Discover</span></router-link></li>
      <li><router-link to="/"><i class="fas fa-book"></i> <span class="router-link-text">Download</span></router-link></li>
      <li><router-link to="/"><i class="fas fa-heart"></i> <span class="router-link-text">Favorites</span></router-link></li>
      <li><router-link to="/"><i class="fas fa-user"></i> <span class="router-link-text">Profile</span></router-link></li>
      <li><router-link to="/"><i class="fas fa-sign-out-alt"></i> <span class="router-link-text">Logout</span></router-link></li>
      <li><router-link to="/about"><i class="fas fa-question-circle"></i> <span class="router-link-text">About</span></router-link></li>
    </ul>
  </nav>
 </div>
</template>

<style scoped lang="scss">
.app-bar {
  width: 110px;
  height: 100vh;
  background-color: #acb0f1;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 1rem;
  border-radius: 0 10% 10% 0;
}

nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin-bottom: 0.5rem;
}

nav li a {
  text-decoration: none;
  font-size: 1.2rem;
  color:#1d1549;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

nav li a:hover {
  background-color: #9598d2;
}

@media (max-width: 1084px) {
  .app-bar {
    width: 60px;
  }

  nav li a {
    justify-content: center;
    padding: 0.5rem;
  }

  nav li a .router-link-text {
    display: none;
  }

  nav li a i {
    margin-right: 0;
    font-size: 1.5rem;
  }
}
</style>
