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
  <div class="goodreads-doc">
    <DocumentationCard>
      <DocumentationSection>
        <SectionTitle>How to use Gutenberg Source?</SectionTitle>
        <SourceDescription>
          Project Gutenberg API allows access to the entire Project Gutenberg catalogue of books. 
          Dataset includes over 60 000 books, use pagination to browse catalogue in JSON format. 
          For downloading book resources or gathering more information, copy it's id and use in Goodreads Detailed Source tab.
        </SourceDescription>
        
        <InstructionSection>
          <h3>Tips & Best Practices</h3>
          <ul>
            <li>This source allows to browse full Project Gutenberg catalogue.</li>
            <li>If you search for specific book, go to another source that provides Gutenberg ID</li>
            <li>Other sources with Gutenberg ID include: Open Lib, Goodreads, Anna's Archive</li>
            <li>If you want to download resources, copy Gutenberg id and go to 'Gutenberg Detailed' tab</li>
            <li>Go to <a href="https://gnikdroy.pythonanywhere.com/">https://gnikdroy.pythonanywhere.com/</a> for more information</li>
          </ul>
        </InstructionSection>
      </DocumentationSection>
      
      <FieldTable>
        <tr>
          <td>Page</td>
          <td>Catalogue page, see which page you are on in response data</td>
          <td>1</td>
        </tr>
      </FieldTable>
    </DocumentationCard>
  </div>
</template>

<style lang="scss">
// No styles
</style>