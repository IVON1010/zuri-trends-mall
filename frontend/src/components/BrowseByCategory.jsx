import { useEffect, useState } from 'react';
import './BrowseByCategory.css';

const BrowseByCategory = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState(null);

  // Fetch catalogs and products
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/catalogs');
        const data = await response.json();
        setCatalogs(data);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCatalogs();
    fetchProducts();
  }, []);

  // Handle catalog (category) selection
  const handleCatalogClick = (catalogId) => {
    setSelectedCatalogId(catalogId);
  };

  // Filter products based on the selected catalog
  const filteredProducts = selectedCatalogId
    ? products.filter(product => product.catalog_id === selectedCatalogId)
    : products;

  return (
    <section className="browse-by-category">
      <h2>Browse By Category</h2>
      <div className="categories">
        {catalogs.map(catalog => (
          <button 
            key={catalog.id} 
            className="category" 
            onClick={() => handleCatalogClick(catalog.id)}
          >
            <img 
              src={catalog.image_path} 
              alt={catalog.name} 
              onError={(e) => e.target.src = 'default_image_path_here.jpg'} // Add a default image if the image fails to load
            />
            <h3>{catalog.name}</h3>
          </button>
        ))}
      </div>

      {selectedCatalogId && (
        <div className="filtered-categories">
          <h3>Selected Category</h3>
          {filteredProducts.map(product => (
            <div key={product.id} className="category-item">
              <img 
                src={product.image_path} 
                alt={product.name} 
                onError={(e) => e.target.src = 'default_image_path_here.jpg'} // Add a default image if the image fails to load
              />
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BrowseByCategory;
