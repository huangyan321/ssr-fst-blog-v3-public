import type { Request } from 'express';
import type { IsStatic, IsStaticApi } from 'is';

interface hyRequest extends Request {
  Model?: any;
  modelName?: any;
}
interface ValidObject {
  key?: string;
  type: any;
  reg?: RegExp;
}
type Valid = ValidObject[];
interface hyGlobal extends globalThis {
  globalKey: string;
}
interface SSRServerContext {
  url: string;
  title?: string;
  next: NextFunction;
  store?: Store;
}
interface ServerBundleType {
  serverEntry: (context: SSRServerContext) => Promise<App>;
}
