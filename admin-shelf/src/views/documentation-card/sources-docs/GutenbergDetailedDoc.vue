<script setup lang="ts">
import DocumentationCard from '@/views/documentation-card/DocumentationCard.vue';
import DocumentationSection from '@/views/documentation-card/components/DocumentationSection.vue';
import FieldTable from '@/views/documentation-card/components/FieldTable.vue';
import InstructionSection from '@/views/documentation-card/components/InstructionSection.vue';
import SectionTitle from '@/views/documentation-card/components/SectionTitle.vue';
import SourceDescription from '@/views/documentation-card/components/SourceDescription.vue';

// Static component
</script>

<template>
  <div class="gutenberg-detailed-doc">
    <DocumentationCard>
      <DocumentationSection>
        <SectionTitle border-color="#25a146">How to use Gutenberg Detailed Source?</SectionTitle>
        <SourceDescription>
          Project Gutenberg API allows access to the entire Project Gutenberg catalogue of books. 
          This specific tab allows to retrieve detailed information, including resources, meta data and other. 
          This is the best source for getting book downloads or other resources.
        </SourceDescription>
        
        <InstructionSection>
          <h3>Tips & Best Practices</h3>
          <ul>
            <li>This source allows to get all book data and resources by Gutenberg ID</li>
            <li>If you want to browse full catalogue go to 'Gutenberg' tab</li>
            <li>For more information go to: <a href="https://gnikdroy.pythonanywhere.com/">https://gnikdroy.pythonanywhere.com/</a></li>
          </ul>
        </InstructionSection>
      </DocumentationSection>
      
      <FieldTable>
        <tr>
          <td>ID</td>
          <td>Project Gutenberg ID</td>
          <td>24848</td>
        </tr>
      </FieldTable>
    </DocumentationCard>
  </div>
</template>

<style lang="scss">
// No styles
</style>