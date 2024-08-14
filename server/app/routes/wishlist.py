from flask import Blueprint, request, jsonify
from server.app.models import Wishlist
from server.app.extensions import db

wishlist_bp = Blueprint('wishlist_bp', __name__)

@wishlist_bp.route('/wishlists', methods=['GET'])
def get_wishlists():
    wishlists = Wishlist.query.all()
    return jsonify([wishlist.as_dict() for wishlist in wishlists])

@wishlist_bp.route('/wishlists/<int:id>', methods=['GET'])
def get_wishlist(id):
    wishlist = Wishlist.query.get_or_404(id)
    return jsonify(wishlist.as_dict())

@wishlist_bp.route('/wishlists', methods=['POST'])
def create_wishlist():
    data = request.get_json()
    if not data or not all(key in data for key in ['user_id', 'product_id']):
        return jsonify({'error': 'Invalid input'}), 400

    wishlist = Wishlist(
        user_id=data['user_id'],
        product_id=data['product_id']
    )
    try:
        db.session.add(wishlist)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(wishlist.as_dict()), 201

@wishlist_bp.route('/wishlists/<int:id>', methods=['PUT'])
def update_wishlist(id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid input'}), 400

    wishlist = Wishlist.query.get_or_404(id)
    wishlist.user_id = data.get('user_id', wishlist.user_id)
    wishlist.product_id = data.get('product_id', wishlist.product_id)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(wishlist.as_dict())

@wishlist_bp.route('/wishlists/<int:id>', methods=['DELETE'])
def delete_wishlist(id):
    wishlist = Wishlist.query.get_or_404(id)
    try:
        db.session.delete(wishlist)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return '', 204
