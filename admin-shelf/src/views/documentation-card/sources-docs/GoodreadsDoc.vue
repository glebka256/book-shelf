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
        <SectionTitle border-color="#fcc349">How to use Goodreads Source?</SectionTitle>
        <SourceDescription>
          Search from around 68 thousand books on Goodreads. Provide query of book keyword and see JSON results.
        </SourceDescription>
        
        <InstructionSection>
          <h3>Tips & Best Practices</h3>
          <ul>
            <li>Query can be isbn, title, author, subject or any other frequent keyword in a book</li>
            <li>ISBN searches are the most accurate way to find specific book</li>
            <li>Do not mix up different queries</li>
            <li>Go to <a href="https://www.goodreads.com/api">https://www.goodreads.com/api</a> for more information</li>
          </ul>
        </InstructionSection>
      </DocumentationSection>
      
      <FieldTable>
        <tr>
          <td>Query</td>
          <td>Query keyword: isbn, title, author, subject etc.</td>
          <td>Harry Potter</td>
        </tr>
      </FieldTable>
    </DocumentationCard>
  </div>
</template>

<style lang="scss">
// No styles
</style>