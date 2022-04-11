const getStatus = (product, defaultStatus) => {
  if (product.stock) {
    if (!product.stock.manage_stock) return 'ok';
    else return product.stock.is_in_stock ? 'ok' : 'out_of_stock';
  }

  return defaultStatus
}

export default getStatus
