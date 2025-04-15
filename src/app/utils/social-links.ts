import { ShareLink, Socials } from "@interfaces/quote-card.interface"

export const SHARE_SOCIAL: Record<Socials, ShareLink> = {
  whatsapp: {
    link: 'https://api.whatsapp.com/send?text=',
    hasText: true
  },
  linkedin: {
    link: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    hasText: false
  },
  facebook: {
    link: 'https://www.facebook.com/sharer/sharer.php?u=',
    hasText: false
  },
  x: {
    link: 'https://twitter.com/intent/tweet?text=',
    hasText: true
  },
  copy: {
    link: '',
    hasText: true
  }
}