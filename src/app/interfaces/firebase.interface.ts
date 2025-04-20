import { Timestamp } from "firebase/firestore"

export interface FireResp {
  addedDate: Timestamp,
  author: string,
  author_slug: string,
  categories: string[],
  description: string,
  id: string
}