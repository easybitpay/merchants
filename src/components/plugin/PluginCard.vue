<script setup></script>

<template>
  <div class="premium-plugin-card">
    <div class="plugin-visual">
      <div class="plugin-background"></div>
      <div class="plugin-icon">
        <img src="/media/icons/companies/wordpress.png" alt="wordpress" />
      </div>
    </div>

    <div class="plugin-content">
      <div class="plugin-header">
        <div class="plugin-info">
          <div class="plugin-badge">Plugin</div>
          <h3 class="plugin-name">Wordpress</h3>
        </div>

        <div class="plugin-meta">
          <div class="meta-item">
            <span class="meta-value">12.32 mb</span>
            <span class="meta-label">Size</span>
          </div>

          <div class="meta-divider"></div>

          <div class="meta-item">
            <span class="meta-value">2.34</span>
            <span class="meta-label">Version</span>
          </div>

          <div class="meta-divider"></div>

          <div class="meta-item">
            <span class="meta-value">20.10.24</span>
            <span class="meta-label">Release</span>
          </div>

          <div class="meta-divider"></div>

          <div class="meta-item">
            <span class="meta-value">$76.00</span>
            <span class="meta-label">Price</span>
          </div>
        </div>
      </div>

      <div class="plugin-actions">
        <button type="button" class="btn-docs">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h12M4 10h12M4 14h8"/>
          </svg>
        </button>

        <button class="btn-download">
          <span>Download</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v8m0 0l3-3m-3 3L5 8"/>
            <path d="M3 13h10"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-plugin-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }

  @media (max-width: 991px) {
    flex-direction: column;
  }
}

.plugin-visual {
  position: relative;
  width: 280px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  @media (max-width: 991px) {
    width: 100%;
    min-height: 180px;
  }
}

.plugin-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(/media/images/banner/auth-bg.jpg);
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    mix-blend-mode: overlay;
  }
}

.plugin-icon {
  position: relative;
  z-index: 1;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.plugin-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.plugin-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 1199px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}

.plugin-info {
  flex-shrink: 0;
}

.plugin-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.plugin-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.plugin-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  overflow-x: auto;

  @media (max-width: 1199px) {
    width: 100%;
  }
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex-shrink: 0;
}

.meta-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.meta-label {
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
}

.meta-divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
  flex-shrink: 0;

  @media (max-width: 1199px) {
    display: none;
  }
}

.plugin-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.btn-docs {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
  }
}

.btn-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 200px;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);

    svg {
      transform: translateY(2px);
    }
  }

  @media (max-width: 767px) {
    max-width: none;
  }
}
</style>
