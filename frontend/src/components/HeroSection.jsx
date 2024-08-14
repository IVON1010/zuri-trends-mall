import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Find Clothes That Matches Your Style</h1>
        <div className="hero-buttons">
          <button className="shop-now">Shop Now</button>
        </div>
      </div>
      <div className="brand-logos">
        <span>VERSACE</span>
        <span>ZARA</span>
        <span>GUCCI</span>
        <span>PRADA</span>
        <span>Calvin Klein</span>
      </div>
    </section>
  );
};

export default HeroSection;
