from flask import Blueprint, request, jsonify
from server.app.models import Payment
from server.app.extensions import db
from requests.auth import HTTPBasicAuth
import requests
import base64
import uuid
import random
import string
from datetime import datetime

payment_bp = Blueprint('payment_bp', __name__)

CONSUMER_KEY = 'yty83hjgw0EEGrxoV9j3AAQxVJL2hmjcvYMPxsjXH2ghL8AF'
CONSUMER_SECRET = 'asJhwuTM0XXBWyTJwCWgPWITuucxPoDkNiQWfeTQGgjGraLyl5KO6Ay93sxrSwIm'
BUSINESS_SHORT_CODE = '174379'
LIPA_NA_MPESA_ONLINE_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
CALLBACK_URL = 'https://yourdomain.com/path'
COMPANY_NAME = 'Zuri-Trends'

def generate_transaction_id(length=12):
    """Generate a random transaction ID."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def get_access_token():
    """Get an access token from Safaricom API."""
    try:
        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
        response.raise_for_status()
        json_response = response.json()
        return json_response['access_token']
    except requests.RequestException as e:
        return {'error': str(e)}

def lipa_na_mpesa_online(amount, phone_number, transaction_id):
    """Initiate MPesa payment."""
    
    # Ensure the phone number is in the correct format (e.g., 254712345678)
    # Convert phone number starting with '0' to '2547XXXXXXXX'
    if phone_number.startswith('0'):
        phone_number = '254' + phone_number[1:]
    # Remove '+' if the phone number starts with '+254'
    elif phone_number.startswith('+'):
        phone_number = phone_number[1:]

    access_token_response = get_access_token()
    if isinstance(access_token_response, dict) and 'error' in access_token_response:
        return access_token_response

    access_token = access_token_response

    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(
        (BUSINESS_SHORT_CODE + LIPA_NA_MPESA_ONLINE_PASSKEY + timestamp).encode()
    ).decode('utf-8')

    # Prepare the payload with the correctly formatted phone number
    payload = {
        "BusinessShortCode": BUSINESS_SHORT_CODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,  # Use the formatted phone number here
        "PartyB": BUSINESS_SHORT_CODE,
        "PhoneNumber": phone_number,  # And here as well
        "CallBackURL": CALLBACK_URL,
        "AccountReference": transaction_id,
        "TransactionDesc": f"Payment to {COMPANY_NAME} for Transaction ID {transaction_id} and Amount KSh {amount}"
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    try:
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        # If an error occurs, include the response from the server if available
        if e.response is not None:
            return {'error': f"{str(e)} - {e.response.json()}"}
        return {'error': str(e)}


@payment_bp.route('/payments', methods=['GET'])
def get_payments():
    """Get all payments."""
    payments = Payment.query.all()
    return jsonify([payment.as_dict() for payment in payments])

@payment_bp.route('/payments/<int:id>', methods=['GET'])
def get_payment(id):
    """Get a specific payment by ID."""
    payment = Payment.query.get_or_404(id)
    return jsonify(payment.as_dict())

@payment_bp.route('/payments', methods=['POST'])
def create_payment():
    """Create a new payment."""
    data = request.get_json()
    if not data or not all(key in data for key in ['amount', 'phone_number']):
        return jsonify({'error': 'Invalid input'}), 400

    amount = data['amount']
    phone_number = data['phone_number']
    transaction_id = generate_transaction_id()  # Use the function to generate a transaction ID

    response = lipa_na_mpesa_online(amount, phone_number, transaction_id)
    if 'error' in response:
        return jsonify(response), 500

    payment_status = 'Pending'
    if response.get('ResponseCode') == '0':
        payment_status = 'Successful'
    else:
        payment_status = 'Failed'

    payment = Payment(
        user_id=data.get('user_id', None),
        amount=amount,
        transaction_id=transaction_id,
        status=payment_status
    )
    db.session.add(payment)
    db.session.commit()

    return jsonify({
        'payment': payment.as_dict(),
        'mpesa_response': response
    }), 201

@payment_bp.route('/payments/<int:id>', methods=['PUT'])
def update_payment(id):
    """Update an existing payment."""
    data = request.get_json()
    payment = Payment.query.get_or_404(id)

    if 'amount' in data:
        payment.amount = data['amount']
    if 'transaction_id' in data:
        payment.transaction_id = data['transaction_id']
    if 'status' in data:
        payment.status = data['status']

    db.session.commit()
    return jsonify(payment.as_dict())

@payment_bp.route('/payments/<int:id>', methods=['DELETE'])
def delete_payment(id):
    """Delete a payment."""
    payment = Payment.query.get_or_404(id)
    db.session.delete(payment)
    db.session.commit()
