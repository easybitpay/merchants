<script setup>
// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="premium-faq-item">
    <button
      class="faq-question"
      type="button"
      data-bs-toggle="collapse"
      :data-bs-target="`#faq-${item.id}`"
      aria-expanded="false"
      :aria-controls="`faq-${item.id}`"
    >
      <span class="question-text">{{ item.title }}</span>
      <svg class="chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 8 10 12 14 8"/>
      </svg>
    </button>
    
    <div :id="`faq-${item.id}`" class="faq-answer collapse" data-bs-parent=".faq-accordion">
      <div class="answer-content">
        <p class="answer-text">{{ item.description }}</p>

        <!-- User Reaction -->
        <div class="reaction-section">
          <div class="reaction-question">
            <p class="reaction-label">Did this answer your question?</p>
            <div class="emoji-buttons">
              <button class="emoji-btn" title="Yes, helpful">
                <img src="/media/icons/emoji/happy.png" alt="Happy" />
              </button>
              <button class="emoji-btn" title="Not really">
                <img src="/media/icons/emoji/neutral.png" alt="Neutral" />
              </button>
              <button class="emoji-btn" title="No, not helpful">
                <img src="/media/icons/emoji/sad.png" alt="Sad" />
              </button>
            </div>
          </div>
          
          <button class="btn-edit">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M10 1.5l2.5 2.5M1 13l2.5-2.5L11 3l-2.5-2.5L1 8v5h5z"/>
            </svg>
            Need to Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-faq-item {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  &[aria-expanded="true"] {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;

    .chevron-icon {
      transform: rotate(180deg);
    }
  }
}

.question-text {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
}

.chevron-icon {
  flex-shrink: 0;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.faq-answer {
  &.collapsing {
    transition: height 0.3s ease;
  }
}

.answer-content {
  padding: 1.5rem;
}

.answer-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #374151;
  margin: 0 0 1.5rem 0;
}

.reaction-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.reaction-question {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 576px) {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
}

.reaction-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
}

.emoji-buttons {
  display: flex;
  gap: 0.75rem;
}

.emoji-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: #f9fafb;
    border-color: #6366f1;
    color: #6366f1;
  }
}
</style>
