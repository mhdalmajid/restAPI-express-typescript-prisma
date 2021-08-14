import 'express';
import { IPayload } from "./payload";

declare module 'express' {
  interface Request {
    locals?: IPayload
    user?:any
  }
}
