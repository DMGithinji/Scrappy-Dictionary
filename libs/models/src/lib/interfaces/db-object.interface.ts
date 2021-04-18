import { firestore } from 'firebase-admin';

export interface IObject {
  id?: string;
  createdAt?: firestore.Timestamp;
}
