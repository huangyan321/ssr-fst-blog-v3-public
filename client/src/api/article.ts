import request from '@/service';
import type { QueryAllBlogsType } from './type';
import type { DateType } from '@/service/request/type';
import type { QueryBlogsBySelectTagsType } from './type';

export function queryAllBlogs(params: QueryAllBlogsType) {
  return request.get<DateType>({
    url: 'blogs/queryAll',
    params
  });
}
export function queryOneBlog(blog_id: number) {
  return request.get<DateType>({
    url: 'blogs/query',
    params: { blog_id }
  });
}
export function queryBlogsBySelectTags(params: QueryBlogsBySelectTagsType) {
  return request.get<DateType>({
    url: 'blogs/queryAll',
    params
  });
}
