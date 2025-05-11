<script setup lang="ts">
import DocumentationCard from '@/views/documentation-card/DocumentationCard.vue';
import DocumentationSection from '@/views/documentation-card/components/DocumentationSection.vue';
import SourceDescription from '@/views/documentation-card/components/SourceDescription.vue';

// Static component
</script>

<template>
  <div class="gutenberg-detailed-doc">
    <DocumentationCard>
      <DocumentationSection>
        <SourceDescription class="red-text">
          This source is no longer supported. Contact for more details: <a href="mailto:glebkarpenko1@gmail.com">glebkarpenko1@gmail.com</a>
        </SourceDescription>
      </DocumentationSection>
    </DocumentationCard>
  </div>
</template>

<style lang="scss">
.red-text {
  color: red;
}
</style>