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
  <div class="open-lib-doc">
    <DocumentationCard>
      <DocumentationSection>
        <SectionTitle border-color="#4979fc">How to use Open Library Source?</SectionTitle>
        <SourceDescription>
          The Open Library Search API is one of the most convenient and complete ways to retrieve book data on Open Library.
          Use form to make query and see JSON result.
        </SourceDescription>
        
        <InstructionSection>
          <h3>Tips & Best Practices</h3>
          <ul>
            <li>Query can be isbn, title, author, subject or any other frequent keyword in a book</li>
            <li>ISBN searches are the most accurate way to find specific book</li>
            <li>Use specific queries like title for more accurate search</li>
            <li>Sortimg, limiting and other advanced features are available with q parameter</li>
            <li>For more information go to: <a href="https://www.goodreads.com/api">https://openlibrary.org/dev/docs/api/search</a></li>
          </ul>
        </InstructionSection>
      </DocumentationSection>
      
      <FieldTable>
        <tr>
          <td>q</td>
          <td>The solr query. See tips or Open Library Center for usage details.</td>
          <td>Harry Potter</td>
        </tr>
        <tr>
          <td>Author</td>
          <td>Author name to narrow down search</td>
          <td>Rowling</td>
        </tr>
        <tr>
          <td>Category</td>
          <td>Book subject categort to narrow down search</td>
          <td>Fiction</td>
        </tr>
        <tr>
          <td>Access</td>
          <td>Public availability status: public or false</td>
          <td>false</td>
        </tr>
        <tr>
          <td>Language</td>
          <td>Book language code</td>
          <td>eng</td>
        </tr>
      </FieldTable>
    </DocumentationCard>
  </div>
</template>

<style lang="scss">
// No styles
</style>