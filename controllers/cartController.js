const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

const cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', { cart, totalPrice })
    })
  },
  postCart: (req, res) => {
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
      },
    }).then((cart) => {
      let [carts, create] = [cart[0], cart[1]]
      if (create) {
        CartItem.findAndCountAll({
          where: {
            CartId: carts.dataValues.id,
            ProductId: req.body.productId
          }
        }).then(cartItems => {
          if (cartItems.count === 0) {
            CartItem.create({
              CartId: carts.dataValues.id,
              ProductId: req.body.productId,
              quantity: 1,

            }).catch(error => {
              console.log(error)
            })
          }
          req.session.cartId = carts.dataValues.id
          console.log(req.session.cartId) //checkout
          return req.session.save(() => {
            return res.redirect('back')
          })
        })

      } else {
        CartItem.findOne({
          where: {
            CartId: carts.dataValues.id,
            ProductId: req.body.productId
          }
        }).then(cartUpdate => {
          if (cartUpdate) {
            cartUpdate.update({
              quantity: cartUpdate.dataValues.quantity + 1,
            }).then(newCart => {
              req.session.cartId = carts.dataValues.id
              return req.session.save(() => {
                return res.redirect('back')
              })
            }).catch(error => {
              console.log(error)
            })
          } else {
            CartItem.create({
              CartId: carts.dataValues.id,
              ProductId: req.body.productId,
              quantity: 1,
            }).then(newCart => {
              req.session.cartId = carts.dataValues.id

              return req.session.save(() => {
                return res.redirect('back')
              })
            }).catch(error => {
              console.log(error)
            })
          }

        })
      }

    });
  },
}

module.exports = cartController