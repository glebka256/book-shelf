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
        <SectionTitle border-color="#f041ed">How to use Annas's Arhive Source?</SectionTitle>
        <SourceDescription class="red-text">
          This source is no longer supported. Contact for more details: <a href="mailto:glebkarpenko1@gmail.com">glebkarpenko1@gmail.com</a>
        </SourceDescription>
        
        <InstructionSection>
          <h3>Tips & Best Practices</h3>
          <ul>
            <li>Not all books have resources, try finding book in Gutenberg Detailed</li>
            <li>Query can be isbn, title, author, subject or any other frequent keyword in a book</li>
            <li>ISBN searches are the most accurate way to find specific book</li>
            <li>Author and Category are optional but narrow down the search</li>
          </ul>
        </InstructionSection>
      </DocumentationSection>
      
      <FieldTable>
        <tr>
          <td>Query</td>
          <td>ISBN, title, author, subject etc.</td>
          <td>Harry Potter</td>
        </tr>
        <tr>
          <td>Author</td>
          <td>Specific author search</td>
          <td>Rowling</td>
        </tr>
        <tr>
          <td>Category</td>
          <td>Specific subject category search</td>
          <td>Fiction</td>
        </tr>
      </FieldTable>
    </DocumentationCard>
  </div>
</template>

<style lang="scss">
.red-text {
  color: red;
}
</style>