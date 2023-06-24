const deleteProduct = (btn) => {
  console.log(btn)
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  // const csrf = btn.parentNode.querySelector('name=_crsf').value;

  const productElement = btn.closest('article')

  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
  })
    .then(result => {
      productElement.parentNode.removeChild(productElement);
      console.log(result)
    })
    .catch(err => {
      console.log(err)
    })

} 