from .catalog import catalog_bp
from .product import product_bp
from .user import user_bp
from .review import review_bp
from .wishlist import wishlist_bp
from .cart import cart_bp
from .cart_item import cart_item_bp
from .payment import payment_bp

def register_blueprints(app):
    app.register_blueprint(catalog_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(cart_item_bp)
    app.register_blueprint(payment_bp)
