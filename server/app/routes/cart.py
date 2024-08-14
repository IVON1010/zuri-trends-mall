from flask import Blueprint, request, jsonify
from server.app.models import Cart
from server.app.extensions import db

cart_bp = Blueprint('cart_bp', __name__)

@cart_bp.route('/carts', methods=['GET'])
def get_carts():
    carts = Cart.query.all()
    return jsonify([cart.as_dict() for cart in carts])

@cart_bp.route('/carts/<int:id>', methods=['GET'])
def get_cart(id):
    cart = Cart.query.get_or_404(id)
    return jsonify(cart.as_dict())

@cart_bp.route('/carts', methods=['POST'])
def create_cart():
    data = request.get_json()
    if not data or not all(key in data for key in ['user_id', 'product_id']):
        return jsonify({'error': 'Invalid input'}), 400
    cart = Cart(
        user_id=data['user_id'],
        product_id=data['product_id']
    )
    db.session.add(cart)
    db.session.commit()
    return jsonify(cart.as_dict()), 201

@cart_bp.route('/carts/<int:id>', methods=['PUT'])
def update_cart(id):
    data = request.get_json()
    cart = Cart.query.get_or_404(id)
    if 'user_id' in data:
        cart.user_id = data['user_id']
    if 'product_id' in data:
        cart.product_id = data['product_id']
    db.session.commit()
    return jsonify(cart.as_dict())

@cart_bp.route('/carts/<int:id>', methods=['DELETE'])
def delete_cart(id):
    cart = Cart.query.get_or_404(id)
    db.session.delete(cart)
    db.session.commit()
    return '', 204
