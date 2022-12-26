import type { NextFunction } from 'express';
import type { Store } from 'vuex';

interface SSREntryOptions {
  isServer: boolean;
}
interface SSRServerContext {
  url: string;
  title?: string;
  next: NextFunction;
  state?: string;
}
type platformType = 'pc' | 'mobile' | 'all';
interface topLinkType {
  id: number;
  name?: string;
  route: string;
  widget?: string;
  platform?: platformType;
  noLink?: boolean;
  permanent?: boolean;
}
type topLinkTypes = topLinkType[];
