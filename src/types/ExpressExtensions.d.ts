//I want the full publisher object on the request put there during authentication step
declare namespace Express {
   export interface Request {
      publisherUUID: string
   }
}