from flask import Blueprint, request, jsonify
from server.app.extensions import db
from server.app.models import User
from werkzeug.security import check_password_hash, generate_password_hash

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({'error': 'Invalid input'}), 400

    user = User.query.filter_by(email=email, name=name).first()

    if user and check_password_hash(user.password, password):
        return jsonify(user.as_dict()), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.as_dict() for user in users])

@user_bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.as_dict())

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or not all(key in data for key in ['name', 'password', 'email']):
        return jsonify({'error': 'Invalid input'}), 400

    hashed_password = generate_password_hash(data['password'])
    user = User(
        name=data['name'],
        password=hashed_password,
        email=data['email']
    )
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(user.as_dict()), 201

@user_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid input'}), 400

    user = User.query.get_or_404(id)
    if 'name' in data:
        user.name = data['name']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    if 'email' in data:
        user.email = data['email']

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify(user.as_dict())

@user_bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    try:
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return '', 204
