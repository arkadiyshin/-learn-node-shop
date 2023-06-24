const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const fileHelper = require('../util/file')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user;
  //console.log(imageUrl)

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: message.msg,
      product: {
        title,
        image,
        price,
        description,
        userId
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: []

    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [message] = errors.array();
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: message.msg,
      product: {
        title,
        image,
        price,
        description,
        userId
      },
    });
  }

  const imageUrl = `/${image.path}`;
  const product = new Product({ title, price, description, imageUrl, userId });

  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        errorMessage: null,
        product: product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [message] = errors.array();
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: message.msg,
      product: {
        title: updatedTitle,
        //imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
    });
  }

  const product = {
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
  }

  if (!image) {
    fileHelper.deleteFile(product.imageUrl);
    product.imageUrl = `/${image.path}`;
  }

  Product
    .findOneAndUpdate({ _id: new ObjectId(prodId), userId: req.user._id }, product)
    .then(result => {
      if (!result) {
        return res.redirect('/')
      }
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product
    .findById(prodId)
    .then(product => {
      if (!product) {
        next(new Error('Product not found.'))
      }
      //fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      // res.redirect('/admin/products');
      res.status(200).json({
        message: 'Success!'
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Deleting product failed!'
      });
    });
};
