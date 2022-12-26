import request from '@/service';
import type { DateType } from '@/service/request/type';

export function queryAllTags(): Promise<DateType> {
  return request.get<DateType>({
    url: 'tags/queryAll',
    method: 'get'
  });
}
