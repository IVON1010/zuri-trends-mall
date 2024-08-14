from flask import Blueprint, request, jsonify
from server.app.models import Product
from server.app.extensions import db

product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.as_dict() for product in products])

@product_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.as_dict())

@product_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    if not data or not all(key in data for key in ['name', 'price', 'quantity', 'catalog_id']):
        return jsonify({'error': 'Invalid input'}), 400
    
    product = Product(
        name=data['name'],
        price=data['price'],
        image_path=data.get('image_path'),
        quantity=data['quantity'],
        catalog_id=data['catalog_id'],
        size=data.get('size'),
        color=data.get('color'),
        description=data.get('description')
    )
    try:
        db.session.add(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(product.as_dict()), 201

@product_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid input'}), 400

    product = Product.query.get_or_404(id)
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.image_path = data.get('image_path', product.image_path)
    product.quantity = data.get('quantity', product.quantity)
    product.catalog_id = data.get('catalog_id', product.catalog_id)
    product.size = data.get('size', product.size)
    product.color = data.get('color', product.color)
    product.description = data.get('description', product.description)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(product.as_dict())

@product_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    try:
        db.session.delete(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return '', 204
