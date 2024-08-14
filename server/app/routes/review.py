from flask import Blueprint, request, jsonify
from server.app.models import Review
from server.app.extensions import db

review_bp = Blueprint('review_bp', __name__)

@review_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([review.as_dict() for review in reviews])

@review_bp.route('/reviews/<int:id>', methods=['GET'])
def get_review(id):
    review = Review.query.get_or_404(id)
    return jsonify(review.as_dict())

@review_bp.route('/reviews', methods=['POST'])
def create_review():
    data = request.get_json()
    if not data or not all(key in data for key in ['product_id', 'user_id', 'rating']):
        return jsonify({'error': 'Invalid input'}), 400

    review = Review(
        product_id=data['product_id'],
        user_id=data['user_id'],
        rating=data['rating'],
        comment=data.get('comment')
    )
    try:
        db.session.add(review)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(review.as_dict()), 201

@review_bp.route('/reviews/<int:id>', methods=['PUT'])
def update_review(id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid input'}), 400

    review = Review.query.get_or_404(id)
    review.product_id = data.get('product_id', review.product_id)
    review.user_id = data.get('user_id', review.user_id)
    review.rating = data.get('rating', review.rating)
    review.comment = data.get('comment', review.comment)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(review.as_dict())

@review_bp.route('/reviews/<int:id>', methods=['DELETE'])
def delete_review(id):
    review = Review.query.get_or_404(id)
    try:
        db.session.delete(review)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return '', 204
