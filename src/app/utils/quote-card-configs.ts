import { ClassCardConfig } from "@entity/CardFactory.class";
import { BaseConfig } from "@interfaces/quote-card.interface";

export type ConfigType = 'creation' | 'edit' | 'user_list' | 'explore_list';

export const ConfigCard: Record<ConfigType, () => BaseConfig> = {
  creation: ClassCardConfig.creatingMode,
  edit: ClassCardConfig.editMode,
  user_list: ClassCardConfig.userList,
  explore_list: ClassCardConfig.exploreList
};