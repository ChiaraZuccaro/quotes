import { Quote } from "@entity/Quote.class";

export type ConfigType = 'creation' | 'edit' | 'user_list' | 'explore_list';
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
export interface BaseBtn {
  id: number,
  icon: string,
}

export interface Btns extends BaseBtn {
  clickFn: (quote: Quote) => void,
}
export interface BaseConfig {
  hasSocialEnable: boolean,
  hasDate: boolean,
  hasPinMode: boolean,
  hasFavMode: boolean,
  btns: Btns[],
}