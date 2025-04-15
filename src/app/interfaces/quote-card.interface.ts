import { Quote } from "@entity/Quote.class";

export type Socials = 'whatsapp' | 'linkedin' | 'facebook' | 'copy'

export interface ShareItem {
  copied: boolean,
  fn: (quote: Quote, index: number) => void,
  icon: string,
  name: Socials
}

export interface ShareLink {
  link: string,
  hasText: boolean
}