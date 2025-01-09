<script setup lang="ts">
import baseInstance from '@/api/baseInstance';
import { defineProps, onMounted, ref, computed } from 'vue';
import { Book } from '@/types/Book';
import CommonButton from '@/components/common/buttons/CommonButton.vue';
import TextLoader from '@/components/common/loaders/TextLoader.vue';
import IconButton from '@/components/common/buttons/IconButton.vue';

const props = defineProps({
  bookId: {
    type: String,
    required: true
  }
});

const bookDetails = ref<Book>({} as Book);

const bookAuthor = ref<string>();

// I have to do this because Vue can not access link properties directly.
// I am tired, don't try to make it prettier.
const downloadable = ref<boolean>(false);
const readable = ref<boolean>(false);
const purchasable = ref<boolean>(false);

const isLoading = ref<boolean>(false);

async function fetchBookDetails(bookId: string): Promise<Book> {
  isLoading.value = true;
  
  try {
    const response = await baseInstance.get<Book>(`books/detailed/${bookId}`);
    
    if (!response.data) {
      throw new Error('Invalid book response data.');
    }

    return response.data;
  } catch (error) {
    return {} as Book;
  } finally {
    isLoading.value = false;
  }
}

const bookCover = computed(() => {
  return bookDetails.value.coverUrl || require('@/assets/cover_placeholder.png');
});

function openUrl(url: string) {
  window.open(url, "_blank");
}

onMounted(async () => {
  bookDetails.value = await fetchBookDetails(props.bookId);
  bookAuthor.value = bookDetails.value.author.join(', ');

  // Same garbage because Vue can not access link properties directly.
  if (bookDetails.value.link) {
    downloadable.value = bookDetails.value.link.downloadUrl ? true : false;
    readable.value = bookDetails.value.link.readUrl ? true : false;
    purchasable.value = bookDetails.value.link.buyUrl ? true : false;
  }
});
</script>

<template>
 <div class="book-sidebar">
  <button class="close-button" @click="$emit('close')">Close</button>
  <TextLoader v-if="isLoading" loader-text="Gathering book data..."/>
  <div v-else class="content">
    <img 
      class="image-cover"
      :src="bookCover"
      alt="Book Cover"
    >
    <h2 class="title">{{ bookDetails.title }}</h2>
    <h3 class="author">{{ bookAuthor }}</h3>
    <div class="info-row">
      <span class="detail-text"><i class="fas fa-heart"></i></span>
      <span class="detail-text" id="rating">4.7</span>
      <span class="detail-text">Add to favorites</span>
      <IconButton :icon-type="'add'" :icon-size="1.8"/>
    </div>
    <div class="info-row">
      <CommonButton v-if="readable" @click="openUrl(bookDetails.link.readUrl)">Read</CommonButton>
      <CommonButton v-if="downloadable" @click="openUrl(bookDetails.link.downloadUrl)">Download</CommonButton>
      <CommonButton v-if="purchasable" @click="openUrl(bookDetails.link.buyUrl)">Buy</CommonButton>
    </div>
  </div>
 </div>
</template>

<style scoped lang="scss">
.book-sidebar {
  // positioning
  position: fixed;
  top: 66px;
  right: 0;
  height: 86%;
  width: 380px;
  z-index: 15;

  // display
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  // styling
  background: linear-gradient(115deg, #cbdbf2, #acb0f1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
  transition: transform 0.3s ease;

  // slide transition animations
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-enter {
    transform: translateX(100%);
  }

  .slide-leave-to {
    transform: translateX(100%);
  }

  // Scrollbar customization
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #868686;
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .image-cover {
      width: 200px;
      height: 300px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      margin-bottom: 20px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      color: #333;
    }

    .author {
      font-size: 18px;
      font-weight: 500;
      margin-top: -2px;    // just hacking a bit
      margin-bottom: 24px;
      text-align: center;
      color: #333;
    }

    .info-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
      margin-bottom: 12px;

      #rating {
        font-size: 20px;
        margin-right: 10px;
      }

      .detail-text {
        font-size: 16px;
        font-weight: 600;
        color: #333;

        i {
          margin-left: 5px;
          color: #e63946;
        }

        button {
          background-color: #868686;
        }
      }
    }
  }

  h1 {
    font-size: 16px;
    color: #999;
    margin-top: 20px;
    text-align: center;
  }
}
</style>
