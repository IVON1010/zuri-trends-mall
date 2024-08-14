from flask import Flask
from flask_cors import CORS
from server.app.extensions import db, migrate
from server.app.config import Config
import click

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)

    app.config['DEBUG'] = True

    db.init_app(app)
    migrate.init_app(app, db)

    from server.app.routes.catalog import catalog_bp
    from server.app.routes.product import product_bp
    from server.app.routes.user import user_bp
    from server.app.routes.review import review_bp
    from server.app.routes.wishlist import wishlist_bp
    from server.app.routes.cart import cart_bp
    from server.app.routes.payment import payment_bp

    app.register_blueprint(catalog_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(payment_bp)

    @app.cli.command('seed')
    @click.argument('type', default='all')
    def seed(type):
        """Seed the database."""
        from seed import seed_all
        if type == 'all':
            seed_all()
        else:
            click.echo(f"Unknown seed type: {type}")

    @app.cli.command('show-routes')
    def show_routes():
        """Show all registered routes."""
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            print(f"{rule.endpoint:30s} {methods:20s} {rule}")

    return app
