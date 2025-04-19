import { BaseCard } from "@factories/quote-card-config/BaseCard.class";
import { CreationCard } from "@factories/quote-card-config/CreationCard.class";
import { EditCard } from "@factories/quote-card-config/EditCard.class";
import { ExploreListCard } from "@factories/quote-card-config/ExploreListCard.class";
import { UserListCard } from "@factories/quote-card-config/UserListCard.class";
import { ConfigType } from "@interfaces/quote-card.interface";
import { QuotesService } from "@services/quotes.service";

export const ConfigCard: Record<ConfigType, new (qService: QuotesService) => BaseCard> = {
  creation: CreationCard,
  edit: EditCard,
  user_list: UserListCard,
  explore_list: ExploreListCard
};