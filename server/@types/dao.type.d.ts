import type { Request, Response } from 'express';

declare class Admin {
  static login: (req: Request, res: Response) => void;
  static getUserInfo: (req: Request, res: Response) => void;
}
declare class Blog {
  static add?: (req: Request, res: Response) => void;
  static delete?: (req: Request, res: Response) => void;
  static edit?: (req: Request, res: Response) => void;
  static changeBlogTopStatus?: (req: Request, res: Response) => void;
  static changeBlogPublicStatus?: (req: Request, res: Response) => void;
  static queryOne: (req: Request, res: Response) => void;
  static queryByType: (req: Request, res: Response) => void;
}
declare class Upload {
  static imgUpload: (req: Request, res: Response) => void;
}
declare class Note {
  static add: (req: Request, res: Response) => void;
  static delete: (req: Request, res: Response) => void;
  static changeNotePublicStatus: (req: Request, res: Response) => void;
  static queryByType: (req: Request, res: Response) => void;
}
declare class Tag {
  static queryByType: (req: Request, res: Response) => void;
}
declare class User {
  static add: (req: Request, res: Response) => void;
  static delete: (req: Request, res: Response) => void;
  static edit: (req: Request, res: Response) => void;
  static queryOne: (req: Request, res: Response) => void;
  static queryByType: (req: Request, res: Response) => void;
}
interface DaoType {
  admin: {
    Admin: Admin;
    Blog: Blog;
    Img: Upload;
    Note: Note;
    Tag: Tag;
    User: User;
  };
  user: {
    Blog: Blog;
    Tag: Tag;
  };
}
