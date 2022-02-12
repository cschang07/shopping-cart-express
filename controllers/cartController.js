const db = require('../models');
const userController = require('./api/userController');
const Cart = db.Cart
const User = db.User
const CartItem = db.CartItem
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

const cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', { cart: cart.toJSON(), totalPrice })
    })
  },
  // postCart: (req, res) => {
  //   return Cart.findOrCreate({
  //     //check if a cart already exists in req.session. Set it to 0 if it doesn't.
  //     where: {
  //       UserId: req.body.userId || 0, //請前端協助在按鈕中埋req.body.userId
  //     },
  //   }).then(cart => {
  //     //check if the product we want to add is already in the cart, create one if it isn't. 
  //     return CartItem.findOrCreate({
  //       where: {
  //         CartId: cart[0].dataValues.id,
  //         ProductId: req.body.productId
  //       },
  //       default: {
  //         CartId: cart[0].dataValues.id,
  //         ProductId: req.body.productId,
  //       }
  //     }).then(cartItem => {
  //       //Increase quantity by 1
  //       cartItem[0].update({ quantity: (cartItem[0].dataValues.quantity || 0) + 1})
  //     }).catch(err => console.log(err))
  //   });
  // },
  postCart: (req, res) => {
    return User.findByPk(req.body.idToFindCart, {include: Cart})
    .then(result => {
      console.log('===============')
      console.log(result)
      console.log('===============')
      //check if the product we want to add is already in the cart, create one if it isn't. 
      // return CartItem.findOrCreate({
      //   where: {
      //     CartId: cart[0].dataValues.id,
      //     ProductId: req.body.productId
      //   },
      //   default: {
      //     CartId: cart[0].dataValues.id,
      //     ProductId: req.body.productId,
      //   }
      // }).then(cartItem => {
      //   //Increase quantity by 1
      //   cartItem[0].update({ quantity: (cartItem[0].dataValues.quantity || 0) + 1 })
      // }).catch(err => console.log(err))
    });
  },
  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1,
      })
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.destroy()
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = cartController