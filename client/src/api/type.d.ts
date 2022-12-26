export interface QueryAllBlogsType {
  pageNum?: number;
  pageSize?: number;
  words?: string;
  type: number;
}
export interface QueryBlogsBySelectTagsType {
  pageNum?: number;
  pageSize?: number;
  tag_id?: string;
  type: number;
}
