<script setup lang="ts">
// Static component
</script>

<template>
  <div class="input-fields-section">
    <h3>Available Search Fields</h3>
    <div class="table-container">
      <table class="fields-table">
        <thead>
          <tr>
            <th>Field Name</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <slot></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.input-fields-section {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.4rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
}

.table-container {
  overflow-x: auto;
}

.fields-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
}
</style>