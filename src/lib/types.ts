export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  contactInfo: string;
  profilePicUrl: string;
};

export type BookCondition = 'new' | 'used-good' | 'used-fair';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  condition: BookCondition;
  originalPrice: number;
  sellingPrice: number;
  sellerId: string;
  sellerName: string;
  sellerContact: string;
  bookImageUrl: string;
};
