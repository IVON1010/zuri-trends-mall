import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';

const locationOptions = {
  Kenya: {
    cities: {
      'Nairobi': 200,
      'Mombasa': 300,
      'Kisumu': 250,
      'Eldoret': 280,
      'Nakuru': 270,
      'Meru': 320,
      'Thika': 290,
      'Kericho': 310,
    }
  },
  USA: {
    cities: {
      'New York': 50,
      'Los Angeles': 70,
      'Chicago': 60,
      'Houston': 65,
      'Phoenix': 55,
      'Philadelphia': 60,
      'San Antonio': 65,
      'San Diego': 70,
    }
  },
  UK: {
    cities: {
      'London': 80,
      'Manchester': 90,
      'Birmingham': 85,
      'Liverpool': 95,
      'Edinburgh': 100,
      'Glasgow': 95,
      'Bristol': 90,
      'Leeds': 85,
    }
  },
  Canada: {
    cities: {
      'Toronto': 60,
      'Vancouver': 70,
      'Montreal': 65,
      'Calgary': 75,
      'Ottawa': 65,
      'Edmonton': 70,
      'Winnipeg': 80,
      'Quebec City': 75,
    }
  },
  Australia: {
    cities: {
      'Sydney': 90,
      'Melbourne': 85,
      'Brisbane': 80,
      'Perth': 95,
      'Adelaide': 85,
      'Gold Coast': 90,
      'Canberra': 80,
      'Hobart': 100,
    }
  },
  Germany: {
    cities: {
      'Berlin': 75,
      'Munich': 85,
      'Frankfurt': 80,
      'Hamburg': 85,
      'Cologne': 90,
      'Stuttgart': 85,
      'Düsseldorf': 80,
      'Dresden': 95,
    }
  },
  France: {
    cities: {
      'Paris': 85,
      'Lyon': 90,
      'Marseille': 95,
      'Toulouse': 90,
      'Nice': 95,
      'Nantes': 85,
      'Strasbourg': 100,
      'Bordeaux': 90,
    }
  },
  India: {
    cities: {
      'Mumbai': 50,
      'Delhi': 55,
      'Bangalore': 60,
      'Hyderabad': 65,
      'Chennai': 60,
      'Kolkata': 55,
      'Pune': 60,
      'Ahmedabad': 55,
    }
  },
  China: {
    cities: {
      'Beijing': 70,
      'Shanghai': 75,
      'Shenzhen': 80,
      'Guangzhou': 85,
      'Chengdu': 75,
      'Hangzhou': 70,
      'Wuhan': 80,
      'Xi\'an': 75,
    }
  },
  Japan: {
    cities: {
      'Tokyo': 100,
      'Osaka': 90,
      'Yokohama': 95,
      'Nagoya': 85,
      'Sapporo': 95,
      'Fukuoka': 85,
      'Kyoto': 90,
      'Kobe': 85,
    }
  },
  Brazil: {
    cities: {
      'São Paulo': 60,
      'Rio de Janeiro': 65,
      'Brasília': 70,
      'Salvador': 65,
      'Fortaleza': 70,
      'Belo Horizonte': 65,
      'Manaus': 80,
      'Curitiba': 75,
    }
  },
  SouthAfrica: {
    cities: {
      'Johannesburg': 70,
      'Cape Town': 75,
      'Durban': 65,
      'Pretoria': 70,
      'Port Elizabeth': 75,
      'Bloemfontein': 80,
      'East London': 75,
      'Kimberley': 85,
    }
  },
  Mexico: {
    cities: {
      'Mexico City': 55,
      'Guadalajara': 60,
      'Monterrey': 65,
      'Puebla': 60,
      'Tijuana': 70,
      'Cancún': 75,
      'Mérida': 70,
      'Chihuahua': 65,
    }
  },
  Nigeria: {
    cities: {
      'Lagos': 50,
      'Abuja': 55,
      'Port Harcourt': 60,
      'Kano': 55,
      'Ibadan': 50,
      'Benin City': 60,
      'Jos': 65,
      'Enugu': 60,
    }
  },
  Russia: {
    cities: {
      'Moscow': 80,
      'Saint Petersburg': 85,
      'Novosibirsk': 90,
      'Yekaterinburg': 85,
      'Nizhny Novgorod': 80,
      'Kazan': 90,
      'Samara': 85,
      'Rostov-on-Don': 95,
    }
  },
  Italy: {
    cities: {
      'Rome': 85,
      'Milan': 90,
      'Naples': 95,
      'Turin': 90,
      'Palermo': 95,
      'Genoa': 90,
      'Bologna': 85,
      'Florence': 100,
    }
  },
  Spain: {
    cities: {
      'Madrid': 85,
      'Barcelona': 90,
      'Valencia': 95,
      'Seville': 90,
      'Zaragoza': 85,
      'Málaga': 90,
      'Murcia': 85,
      'Palma': 100,
    }
  },
  UAE: {
    cities: {
      'Dubai': 70,
      'Abu Dhabi': 75,
      'Sharjah': 65,
      'Al Ain': 70,
      'Ajman': 75,
      'Fujairah': 80,
      'Ras Al Khaimah': 85,
      'Umm Al Quwain': 90,
    }
  },
  SaudiArabia: {
    cities: {
      'Riyadh': 75,
      'Jeddah': 80,
      'Mecca': 85,
      'Medina': 80,
      'Dammam': 75,
      'Khobar': 85,
      'Tabuk': 90,
      'Hail': 95,
    }
  },
  Egypt: {
    cities: {
      'Cairo': 60,
      'Alexandria': 65,
      'Giza': 70,
      'Shubra El-Kheima': 75,
      'Port Said': 80,
      'Suez': 85,
      'Luxor': 90,
      'Aswan': 95,
    }
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = location.state || {};

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    nationality: '',
  });

  const [selectedCity, setSelectedCity] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === 'nationality') {
      setSelectedCity('');
      setDeliveryFee(0);
      setTotalAmount(cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
    }

    if (name === 'city') {
      setSelectedCity(value);
      const cityFee = locationOptions[form.nationality]?.cities[value] || 0;
      setDeliveryFee(cityFee);
      setTotalAmount(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + cityFee);
    }
  };

  const handleContinue = () => {
    navigate('/payment', {
      state: {
        deliveryDetails: form,
        deliveryFee,
        totalAmount,
        cart, // Include cart details
      },
    });
  };

  return (
    <div className="container my-5">
      <h2 className="text-4xl font-bold mb-8 text-center">Checkout</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-2xl font-semibold mb-4">Your Cart Items</h3>
        {cart.length === 0 ? (
          <p className="text-xl text-center text-gray-600">Your cart is empty</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-xl font-semibold text-gray-700">{item.title}</h3>
                  <p className="text-lg text-gray-600 mb-1">Price: {item.price}</p>
                  <p className="text-lg text-gray-600 mb-3">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="text-right mt-4">
              <h3 className="text-3xl font-semibold">Total: {totalAmount.toFixed(2)}</h3>
              <h3 className="text-2xl font-semibold">Delivery Fee: {deliveryFee.toFixed(2)}</h3>
              <h3 className="text-2xl font-semibold">Grand Total: {(totalAmount + deliveryFee).toFixed(2)}</h3>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Nationality</label>
            <select
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select Nationality</option>
              {Object.keys(locationOptions).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          {form.nationality && (
            <div>
              <label className="block text-lg font-medium text-gray-700">City</label>
              <select
                name="city"
                value={selectedCity}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select City</option>
                {Object.keys(locationOptions[form.nationality]?.cities || {}).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continue with Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
