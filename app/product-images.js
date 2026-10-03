export function productImage(product) {
  return product.image || (product.id >= 1 && product.id <= 10 ? `/produce/${product.id}.jpg` : null);
}
