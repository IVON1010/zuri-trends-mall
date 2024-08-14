from .extensions import db
from datetime import datetime

class Catalog(db.Model):
    __tablename__ = 'catalog'
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String, nullable=True)
    name = db.Column(db.String(100), nullable=False)
    products = db.relationship('Product', backref='catalog', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image_path': self.image_path,
            'products': [product.as_dict() for product in self.products]
        }

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_path = db.Column(db.String, nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    catalog_id = db.Column(db.Integer, db.ForeignKey('catalog.id'), nullable=False)
    size = db.Column(db.String(10), nullable=True)
    color = db.Column(db.String(20), nullable=True)
    description = db.Column(db.Text, nullable=True)
    reviews = db.relationship('Review', backref='product', lazy=True)
    wishlists = db.relationship('Wishlist', backref='product', lazy=True)
    cart_items = db.relationship('CartItem', backref='product', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'image_path': self.image_path,
            'quantity': self.quantity,
            'catalog_id': self.catalog_id,
            'size': self.size,
            'color': self.color,
            'description': self.description,
            'reviews': [review.as_dict() for review in self.reviews],
            'wishlists': [wishlist.as_dict() for wishlist in self.wishlists],
            'cart_items': [cart_item.as_dict() for cart_item in self.cart_items]
        }

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    reviews = db.relationship('Review', backref='user', lazy=True)
    wishlists = db.relationship('Wishlist', backref='user', lazy=True)
    carts = db.relationship('Cart', backref='user', lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'password': self.password,
            'email': self.email,
            'reviews': [review.as_dict() for review in self.reviews],
            'wishlists': [wishlist.as_dict() for wishlist in self.wishlists],
            'carts': [cart.as_dict() for cart in self.carts],
            'payments': [payment.as_dict() for payment in self.payments]
        }

class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)

    def as_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'rating': self.rating,
            'comment': self.comment
        }

class Wishlist(db.Model):
    __tablename__ = 'wishlist'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)

    def as_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id
        }

class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    items = db.relationship('CartItem', backref='cart', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'items': [item.as_dict() for item in self.items]
        }

class CartItem(db.Model):
    __tablename__ = 'cart_item'
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    list_price = db.Column(db.Float, nullable=False)  

    def as_dict(self):
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'list_price': self.list_price  
        }

class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transaction_id = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def as_dict(self):
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'user_id': self.user_id,
            'transaction_id': self.transaction_id,
            'amount': self.amount,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }