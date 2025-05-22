<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'

interface Column {
  key: string
  label: string
  headerClass?: string | string[]
  cellClass?: string | string[]
}

interface Props {
  /** Array of data objects to display */
  data: Record<string, any>[]
  /** Array of column configuration objects */
  columns: Column[]
  /** Key to use for row identification (for v-for key) */
  rowKey?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  rowKey: null
})

// Validate columns prop
const validateColumns = (columns: Column[]): boolean => {
  return columns.every(col => col.key && col.label)
}

if (!validateColumns(props.columns)) {
  console.warn('DataTable: All columns must have both key and label properties')
}

// Get value from nested object using dot notation
const getValue = (item: Record<string, any>, key: string): any => {
  return key.split('.').reduce((obj, prop) => obj && obj[prop], item)
}

// Get unique key for each row
const getRowKey = (item: Record<string, any>, index: number): string | number => {
  if (props.rowKey) {
    return getValue(item, props.rowKey)
  }
  return index
}
</script>

<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th 
            v-for="column in columns" 
            :key="column.key"
            :class="column.headerClass"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(item, index) in data" 
          :key="getRowKey(item, index)" 
          class="data-row"
        >
          <td 
            v-for="column in columns" 
            :key="column.key"
            :class="[column.cellClass, `cell-${column.key}`]"
          >
            <slot 
              :name="column.key" 
              :item="item" 
              :value="getValue(item, column.key)"
            >
              {{ getValue(item, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    
    thead {
      background: #f5f5f5;
      
      th {
        padding: 12px 16px;
        text-align: left;
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        
        &:last-child {
          border-right: none;
        }
      }
    }
    
    tbody {
      .data-row {
        &:hover {
          background-color: #f9f9f9;
        }
        
        &:not(:last-child) {
          border-bottom: 1px solid #eee;
        }
        
        td {
          text-align: left;
          padding: 12px 16px;
          border-right: 1px solid #eee;
          
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
}
</style>