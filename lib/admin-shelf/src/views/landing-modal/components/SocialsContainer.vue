<script setup lang="ts">
import { defineProps, PropType } from 'vue';

export interface SocialsIconLink {
  type: 'github' | 'linkdin' | 'telegram' | 'email',
  href: string,
  target?: string,
}

const props = defineProps({
  socialLinks: {
    type: Array as PropType<SocialsIconLink[]>,
    required: true
  }
});

// Icon data to paint SVG for each socials type
const iconData = {
  github: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none",
    strokeWidth: "0",
    path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
  },
  linkdin: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none",
    strokeWidth: "0",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  },
  telegram: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none",
    strokeWidth: "0",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
  },
  email: {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    polyline: "22,6 12,13 2,6"
  }
};

// Get aria-label text for each social type
const getAriaLabel = (type: string): string => {
  const labels = {
    github: 'GitHub Profile',
    linkdin: 'LinkedIn Profile',
    telegram: 'Telegram Profile',
    email: 'Send Email'
  };
  return labels[type as keyof typeof labels] || `${type} Profile`;
};
</script>

<template>
  <div class="socials-container">
    <a v-for="(link, index) in props.socialLinks" :key="index" :href="link.href"
      :target="link.target || (link.type === 'email' ? undefined : '_blank')"
      :rel="link.type !== 'email' ? 'noopener noreferrer' : undefined" :class="`social-link ${link.type}-link`"
      :aria-label="getAriaLabel(link.type)">
      <svg width="24" height="24" :viewBox="iconData[link.type].viewBox" :fill="iconData[link.type].fill"
        :stroke="iconData[link.type].stroke" :stroke-width="iconData[link.type].strokeWidth">
        <path :d="iconData[link.type].path" />
        <polyline v-if="iconData[link.type].polyline" :points="iconData[link.type].polyline" />
      </svg>
    </a>
  </div>
</template>

<style scoped lang="scss">
.socials-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(16, 18, 61, 0.8);
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    &.github-link:hover {
      color: black;
    }

    &.linkdin-link:hover {
      color: #0044cc;
    }

    &.email-link:hover {
      color: #ea4335;
    }

    &.telegram-link:hover {
      color: #0088cc;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
}
</style>