import { Quote } from "@entity/Quote.class";

export type Socials = 'x' | 'whatsapp' | 'linkedin' | 'facebook' | 'copy';

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

// CONFIGS
export interface Btns {
  id: number,
  icon: string,
  clickFn?: () => void,
}
export interface BaseConfig {
  hasSocialEnable: boolean,
  hasDate: boolean,
  btns: Btns[],
}