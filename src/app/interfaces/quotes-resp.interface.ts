export interface QuoteResp {
  author: string,
  authorSlug: string,
  content: string,
  dateAdded: string,
  dateModified: string,
  length: number,
  tags: string[],
  _id: string
}

export interface ExploreList {
  count: number,
  totalCount: number,
  page: number,
  totalPages: number,
  lastItemIndex: number,
  results: QuoteResp[]
}

export interface GeneralResp {
  code: number,
  error: boolean,
  message: string,
}

export interface RandomResp extends GeneralResp {
  result: QuoteResp[]
}

export interface ListResp extends GeneralResp {
  result: ExploreList
}