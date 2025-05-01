<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import { BookData } from '@/types/Book.types';
import BookCover from '@/components/common/BookCover.vue';
import ExtendedInfo from './ExtendedInfo.vue';

const props = defineProps({
  book: {
    type: Object as PropType<BookData>,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  }
});

// Computed property to format rating as stars
const formatRating = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '½';
  
  return stars;
};
</script>

<template>
 <div class="book-card">
  <BookCover 
    :coverUrl="book.coverUrl"
    :title="book.title"
    :complete="book.complete"
  />

  <div class="book-info">
    <h3 class="book-title">{{ book.title }}</h3>
    <p class="book-author">{{ book.author.join(', ') }}</p>
    <div class="book-meta">
      <span class="book-year">{{ book.publishedYear }}</span>
      <span class="book-rating" :title="`Rating: ${book.rating.toFixed(1)}/5`">
        {{ formatRating(book.rating) }}
      </span>
    </div>
  </div>

  <ExtendedInfo v-if="props.isSelected"
    :bookLanguages="book.language"
    :bookSubjects="book.subject"
    :bookLink="book.link"
  />
 </div>
</template>

<style scoped lang="scss">
.book-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 2px solid #4a7bca;
  }
}

.book-info {
  padding: 1rem;
  
  .book-title {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .book-author {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }
  
  .book-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    
    .book-year {
      font-size: 0.85rem;
      color: #777;
    }
    
    .book-rating {
      font-size: 0.85rem;
      color: #f59e0b;
    }
  }
}

@media (max-width: 768px) {
  .book-cover {
    height: 250px;
  }
  
  .book-info .book-title {
    font-size: 1rem;
  }
  
  .book-actions .action-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>