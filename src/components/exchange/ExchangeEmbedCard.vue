<script setup></script>

<template>
  <div class="premium-embed-card">
    <div class="embed-content">
      <div class="embed-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 8L6 16l6 8M20 8l6 8-6 8"/>
          <path d="M14 24l4-16"/>
        </svg>
      </div>

      <div class="embed-text">
        <h4 class="embed-title">Embed Exchange In Your Website</h4>
        <p class="embed-description">
          Integrate our crypto exchange widget into your website. 
          <RouterLink :to="{ name: 'help-knowledge' }" class="embed-link">
            Read documentation
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 3l4 4-4 4"/>
            </svg>
          </RouterLink>
        </p>
      </div>

      <button
        class="btn-embed"
        data-bs-toggle="offcanvas"
        data-bs-target="#exchangeEmbed_offcanvas"
        aria-controls="exchangeEmbed_offcanvas"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 4L4 8l4 4M12 4l4 4-4 4"/>
          <path d="M7 12l6-8"/>
        </svg>
        <span>Get Embed Code</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-embed-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.embed-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.embed-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 0.75rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.embed-text {
  flex: 1;
  min-width: 0;
}

.embed-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.embed-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.embed-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #2563eb;

    svg {
      transform: translateX(2px);
    }
  }
}

.btn-embed {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}
</style>
