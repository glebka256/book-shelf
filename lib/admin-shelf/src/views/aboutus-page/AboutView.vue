<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AboutusData, AppSection, MainLink } from './aboutus.types';
import { getData } from '@/services/dataService';
import WelcomeModal from '@/views/landing-modal/WelcomeModal.vue';
import RouteList from './components/RouteList.vue';
import SocialsContainer from '@/views/landing-modal/components/SocialsContainer.vue';
import StackSection from '@/views/landing-modal/components/StackSection.vue';

const showWelcome = ref(true);
const isDataLoading = ref(false);

const projectDescription = ref<string>('');
const sitemap = ref<AppSection[]>([]);
const mainLinks = ref<MainLink[]>([]);

const loadData = async (): Promise<void> => {
  isDataLoading.value = true;

  try {
    const data = await getData<AboutusData>("aboutus-data.json");
    projectDescription.value = data.projectDescription;
    sitemap.value = data.sitemap;
    mainLinks.value = data.mainLinks; 
  } catch (error) {
    console.error(error);
  }
  finally {
    isDataLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <WelcomeModal :show-modal="showWelcome" @close="showWelcome = false" />
  <div class="about-view">
    <div class="content-container">
      <!-- Title -->
      <h1 class="main-title">About Book Shelf</h1>

      <!-- Project Description -->
      <div class="description-section">
        <p class="description-text">
          {{ projectDescription }}
        </p>
      </div>

      <!-- Main Application Links -->
      <div class="main-links-section" v-if="mainLinks.length > 0">
        <h2 class="section-title">System Components</h2>
        <div class="main-links-grid">
          <a v-for="link in mainLinks" :key="link.title" :href="link.url" class="main-link-card">
            <h3 class="link-title">{{ link.title }}</h3>
            <p class="link-description">{{ link.description }}</p>
          </a>
        </div>
      </div>

      <!-- Site Map -->
      <div class="sitemap-section" v-if="sitemap.length > 0">
        <h2 class="section-title">System Navigation Map</h2>
        <div class="sitemap-lists">
          <div v-for="section in sitemap" :key="section.title" class="list-section">
            <h3 class="list-section-title">{{ section.title }}</h3>
            <RouteList :section="section"></RouteList>
          </div>
        </div>
      </div>

      <div class="footer-container">
        <!-- Social links and contacts -->
        <div class="footer-section-container">
          <h3 class="socials-title">Contact me</h3>
          <SocialsContainer />
        </div>

        <!-- Tech stack used -->
        <div class="footer-section-container">
          <StackSection />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import '@/styles/manager.scss';

.about-view {
  @extend %manager-base;
  font-family: $main-font;
  color: $main-thick-font;
  line-height: 1.6;
}

.content-container {
  max-width: $manager-content-mxwidth;
  margin: 0 auto;
  padding: $manager-subcontent-padding;
}

.main-title {
  font-size: 2.5rem;
  font-weight: $med-thick;
  color: $main-color;
  margin: 0 0 2rem 0;
  text-align: left;
}

.description-section {
  margin-bottom: 3rem;

  .description-text {
    font-size: 1.1rem;
    color: $sec-thick-font;
    line-height: 1.7;
    margin: 0;
    text-align: left;
  }
}

.section-title {
  font-size: 1.8rem;
  font-weight: $med-thick;
  color: $main-color;
  margin: 0 0 1.5rem 0;
  text-align: left;
}

.main-links-section {
  margin-bottom: 3rem;

  .main-links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .main-link-card {
    display: block;
    padding: 1.5rem;
    background: $main-bgcolor;
    border: 1px solid $main-border-color;
    border-radius: 8px;
    box-shadow: $light-shadow;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: $normal-shadow;
      transform: translateY(-2px);
      border-color: $btn-bgcolor;
    }

    .link-title {
      font-size: 1.2rem;
      font-weight: $med-thick;
      color: $main-color;
      margin: 0 0 0.5rem 0;
    }

    .link-description {
      font-size: 0.95rem;
      color: $sec-thick-font;
      margin: 0;
    }
  }
}

.sitemap-section {
  margin-bottom: 3rem;

  .sitemap-lists {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: $small-width) {
      grid-template-columns: 1fr;
    }
  }

  .list-section {
    .list-section-title {
      font-size: 1.2rem;
      font-weight: $med-thick;
      color: $main-color;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid $main-border-color;
    }
  }
}

.footer-container {
  display: flex;
  flex-direction: row;
  gap: 40px;

  .footer-section-container {
    display: flex;
    flex-direction: row;
    align-content: center;

    h3 {
      align-self: center;
      margin: 0;
    }
  }
}

@media (max-width: $small-width) {
  .content-container {
    padding: 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .main-links-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: $smallest-width) {
  .main-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>