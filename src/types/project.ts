export interface Project {
  id: string;
  title: string;
  size: string;
  quantity: number;
  deposit: number;
  total: number;
  orderDate: string;
  currentStateDate: string;
  estimatedDeliveryDate: string;
  deliveredDate: string;
  image?: string;
  createdAt: string;
}
