export type UserT = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

interface getUsersT {
  data: UserT[];
  total: number;
  page: number;
  limit: number;
}
