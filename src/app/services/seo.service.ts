import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoConfig } from '@interfaces/seo.interface';
import { HOME_SEO } from '@seo/home.seo';
import { USER_SEO } from '@seo/user.seo';
import { META_TAGS_MAP } from '@utils/meta-mapper';

type PAGES = 'home' | 'user';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private _title = inject(Title);
  private _meta = inject(Meta);

  private allPagesMeta: Record<PAGES, SeoConfig> = {
    home: HOME_SEO,
    user: USER_SEO
  }

  private updateCanonical(url: string) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }

  public updateMetaTag(page: PAGES) {
    const pageConfig = this.allPagesMeta[page];

    if(pageConfig.title) this._title.setTitle(pageConfig.title);

    for(const [key, value] of Object.entries(pageConfig)) {
      if(!value || key === 'title' || key === 'canonical') continue;

      const metaMapped = META_TAGS_MAP[key];
      if(metaMapped) { this._meta.updateTag({ [metaMapped.attr]: metaMapped.tag, content: value }) }
    }

    if(pageConfig.canonical) this.updateCanonical(pageConfig.canonical);
  }
}
