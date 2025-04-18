import { BaseConfig, Btns } from "@interfaces/quote-card.interface";
import { ConfigType } from "@utils/quote-card-configs";


export class ClassCardConfig implements BaseConfig {
  private allBtns: Btns[] = [
    { icon: 'icon-trash', id: 0 }, { icon: 'icon-edit-pencil', id: 1 },
    { icon: 'icon-save-disk', id: 2 }, { icon: 'icon-close', id: 3 }
  ];
  

  public hasDate: boolean;
  public hasSocialEnable: boolean;
  public btns: Btns[];

  constructor(key: ConfigType) {}

  public static creatingMode(): BaseConfig {
    console.log('creatingMode!!');
    let test = {} as BaseConfig
    return test;
  }

  public static editMode(): BaseConfig {
    console.log('editMode!!');
    let test = {} as BaseConfig
    return test;
  }

  public static userList(): BaseConfig {
    console.log('user list !!');
    let test = {} as BaseConfig
    return test;
  }

  public static exploreList(): BaseConfig {
    console.log('explore list!!');
    let test = {} as BaseConfig
    return test;
  }
}