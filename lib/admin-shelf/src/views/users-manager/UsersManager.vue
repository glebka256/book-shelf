<script setup lang="ts">
import StatCard from '@/components/common/buttons/StatCard.vue';
import { UserStats } from '@/types/User.types';

const userStats: UserStats = {
    "totalFavorites": 38,
    "totalInteraction": 38,
    "users": [
        {
            "username": "Admin",
            "email": "admin@email.com",
            "favoriteCount": 0,
            "interactionCount": 0
        },
        {
            "username": "Aibop",
            "email": "sap@abap.com",
            "favoriteCount": 15,
            "interactionCount": 34
        },
        {
            "username": "DeleteMe",
            "email": "delete@meplease.com",
            "favoriteCount": 0,
            "interactionCount": 0
        },
        {
            "username": "Amuama",
            "email": "amuama@email.com",
            "favoriteCount": 0,
            "interactionCount": 0
        },
        {
            "username": "John Doe",
            "email": "johndoe122323@gmail.com",
            "favoriteCount": 8,
            "interactionCount": 2
        },
        {
            "username": "amioba@amioba.com",
            "email": "amioba@amioba.com",
            "favoriteCount": 15,
            "interactionCount": 2
        }
    ]
}
</script>

<template>
  <div class="users-manager">
    <div class="stats-summary">
      <StatCard label="Total Interactions" :value="userStats.totalInteraction" />
      <StatCard label="Total Favorites" :value="userStats.totalFavorites" />
    </div>

    <div v-if="userStats.users.length === 0" class="empty-state">
      <p>No users found</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.users-manager {
  // TODO import this shared style as global
  margin: 0 0 auto 2rem;
  padding: 1rem;
  
  .stats-summary {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    
    p {
      margin: 0;
    }
  }
}
</style>