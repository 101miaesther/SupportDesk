<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva(
  'rounded-xl font-medium transition backdrop-blur-md border border-border/50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary/25 text-foreground hover:bg-primary/35',
        accent: 'bg-accent/40 text-accent-foreground hover:bg-accent/55',
        secondary: 'bg-secondary/20 text-foreground hover:bg-secondary/30',
        danger: 'bg-destructive/25 text-foreground hover:bg-destructive/35',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

type ButtonVariants = VariantProps<typeof button>

withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', disabled: false }
)
</script>

<template>
  <button :class="button({ variant, size })" :disabled="disabled">
    <slot />
  </button>
</template>