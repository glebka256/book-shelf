<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getStat, PublicationFrequency, StatRoutes, SubjectDivision, UsersActivity, WeeklyFrequency } from "./stat.api";

const loading      = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const totalBooks    = ref<number | null>(null);
const totalSubjects = ref<number | null>(null);
const totalAuthors  = ref<number | null>(null);
const totalUsers    = ref<number | null>(null);

const usersActivity       = ref<UsersActivity | null>(null);
const weeklyActivity      = ref<WeeklyFrequency[] | null>(null);
const subjectDistribution = ref<SubjectDivision[] | null>(null);
const publicationTimeline = ref<PublicationFrequency[] | null>(null);

const loadStats = async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    totalBooks.value    = await getStat<number>(StatRoutes.BooksTotal);
    totalSubjects.value = await getStat<number>(StatRoutes.SubjectsTotal);
    totalAuthors.value  = await getStat<number>(StatRoutes.AuthorsTotal);
    totalUsers.value    = await getStat<number>(StatRoutes.UsersTotal);

    usersActivity.value       = await getStat<UsersActivity>(StatRoutes.UsersActivity);
    weeklyActivity.value      = await getStat<WeeklyFrequency[]>(StatRoutes.WeeklyActivity);
    subjectDistribution.value = await getStat<SubjectDivision[]>(StatRoutes.SubjectDivision);
    publicationTimeline.value = await getStat<PublicationFrequency[]>(StatRoutes.PublicationTimeline);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'; 
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadStats();
});
</script>

<template>
 <div class="stat-manager">
  <h1>This StatManager component</h1>
 </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';

.stat-manager {
  @extend %manager-base;
}
</style>