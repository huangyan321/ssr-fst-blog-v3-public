export interface BlogType {
  blog_id: number | undefined;
  content: string | null;
  create_time: string;
  title: string | undefined;
  update_time: string;
  publish: number;
  brief: string | null;
  is_top: number;
  ext_info: string | null;
  tags: any[] | null;
}
