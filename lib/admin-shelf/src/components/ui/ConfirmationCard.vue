<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref, computed } from 'vue';
import CommonButton from '../common/buttons/CommonButton.vue';

interface Props {
  /** The message to display to the user */
  promptMessage: string;
  /** The label for the confirmation input field */
  inputLabel: string;
  /** The text that needs to be entered to confirm the action */
  confirmationText: string;
  /** The text for the confirm button */
  confirmButtonText?: string;
  /** The text for the cancel button */
  cancelButtonText?: string;
  /** Optional class applied to the confirm button */
  confirmButtonClass?: string;
  /** Optional class applied to the cancel button */
  cancelButtonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn-danger',
  cancelButtonClass: 'btn-secondary'
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const inputValue = ref('');
const isConfirmDisabled = computed(() => {
  return inputValue.value !== props.confirmationText;
});

const hintText = ref(props.confirmationText);
const remainingText = computed(() =>
  hintText.value.slice(inputValue.value.length)
);

const handleConfirm = () => {
  if (!isConfirmDisabled.value) {
    emit('confirm');
  }
};

const handleCancel = () => {
  emit('cancel');
  inputValue.value = '';
};
</script>

<template>
  <div class="confirmation-card">
    <div class="confirmation-card-content">
      <p class="prompt-message">{{ promptMessage }}</p>
      
      <div class="input-group">
        <label :for="inputLabel.replace(/\s+/g, '-').toLowerCase()" class="input-label">
          {{ inputLabel }}
        </label>
        <div class="input-overlay-wrapper">
          <div class="input-overlay-text">
            <span style="color: transparent">{{ inputValue }}</span><span class="faded">{{ remainingText }}</span>
          </div>
          <input
            :id="inputLabel.replace(/\s+/g, '-').toLowerCase()"
            v-model="inputValue"
            type="text"
            class="confirmation-input transparent-input"
          />
        </div>
      </div>
      
      <div class="button-group">
        <CommonButton
          :class="cancelButtonClass"
          @click="handleCancel"
        >
          {{ cancelButtonText }}
        </CommonButton>
        
        <CommonButton
          :class="isConfirmDisabled ? `${confirmButtonClass} disabled` : confirmButtonClass"
          :disabled="isConfirmDisabled"
          @click="handleConfirm"
        >
          {{ confirmButtonText }}
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.confirmation-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.confirmation-card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.prompt-message {
  font-size: 1.125rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.input-overlay-wrapper {
  position: relative;
  width: 100%;
}

.input-overlay-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.625rem;
  pointer-events: none;
  font-size: 1rem;
  font-family: inherit;
  white-space: pre;
  box-sizing: border-box;
  overflow: hidden;
}

.transparent-input {
  background-color: transparent;
  position: relative;
  z-index: 1;
  color: #000;
  width: 100%;
  box-sizing: border-box;
}

.faded {
  color: #aaa;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
}

.confirmation-input {
  width: 100%;
  max-width: 400px;
  padding: 0.625rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>