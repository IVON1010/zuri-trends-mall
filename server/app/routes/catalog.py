from flask import Blueprint, request, jsonify
from server.app.models import Catalog
from server.app.extensions import db

catalog_bp = Blueprint('catalog', __name__)

@catalog_bp.route('/catalogs', methods=['GET'])
def get_catalogs():
    catalogs = Catalog.query.all()
    return jsonify([catalog.as_dict() for catalog in catalogs])

@catalog_bp.route('/catalogs/<int:id>', methods=['GET'])
def get_catalog(id):
    catalog = Catalog.query.get_or_404(id)
    return jsonify(catalog.as_dict())

@catalog_bp.route('/catalogs', methods=['POST'])
def create_catalog():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    catalog = Catalog(name=data['name'])
    db.session.add(catalog)
    db.session.commit()
    return jsonify(catalog.as_dict()), 201

@catalog_bp.route('/catalogs/<int:id>', methods=['PUT'])
def update_catalog(id):
    data = request.get_json()
    catalog = Catalog.query.get_or_404(id)
    if 'name' in data:
        catalog.name = data['name']
        db.session.commit()
        return jsonify(catalog.as_dict())
    return jsonify({'error': 'Invalid input'}), 400

@catalog_bp.route('/catalogs/<int:id>', methods=['DELETE'])
def delete_catalog(id):
    catalog = Catalog.query.get_or_404(id)
    db.session.delete(catalog)
    db.session.commit()
    return '', 204
