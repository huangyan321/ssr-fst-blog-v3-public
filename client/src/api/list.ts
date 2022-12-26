import request from '@/service';
import type { QueryBlogsBySelectTagsType } from './type';
import type { DateType } from '@/service/request/type';

export function queryBlogsBySelectTags(params: QueryBlogsBySelectTagsType) {
  return request.get<DateType>({
    url: 'blogs/queryAll',
    method: 'get',
    params
  });
}
