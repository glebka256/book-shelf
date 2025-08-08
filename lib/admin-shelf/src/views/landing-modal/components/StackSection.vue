<script setup lang="ts">
// Static component
</script>

<template>
  <div class="stack-section">
    <div class="stack-row">
      <span class="stack-label">Tech used</span>
      <div class="stack-container">
        <div class="tech-item typescript" aria-label="TypeScript">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
          </svg>
        </div>
        
        <div class="tech-item vue" aria-label="Vue.js">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/>
          </svg>
        </div>
        
        <div class="tech-item express" aria-label="Express.js">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957c-2.566 1.557-6.056.814-7.731-1.635a5.683 5.683 0 01-.814-3.81l.047-.612c.014-.02.027-.04.027-.057.005-.021.009-.041.009-.062v-.045z"/>
          </svg>
        </div>
        
        <div class="tech-item mongodb" aria-label="MongoDB">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-3.032.284-6.017.49-9.027.3-.185 3.92-2.591 4.312-5.418z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stack-section {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;

  .stack-row {
    display: flex;
    align-items: center;
    gap: 1rem;

    .stack-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: rgba(16, 18, 61, 0.6);
      white-space: nowrap;
    }

    .stack-container {
      display: flex;
      gap: 0.75rem;

      .tech-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        &.typescript {
          color: #3178c6;
        }

        &.vue {
          color: #4fc08d;
        }

        &.express {
          color: #000000;
        }

        &.mongodb {
          color: #47a248;
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>