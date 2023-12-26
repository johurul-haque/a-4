import { Category } from './category.interface';
import { CategoryModel } from './category.model';

export function create(payload: Category) {
  return CategoryModel.create(payload);
}

export function get() {
  return CategoryModel.find();
}
