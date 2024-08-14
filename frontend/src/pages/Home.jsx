import HeroSection from '../components/HeroSection';
import NewArrivals from '../components/NewArrivals';
import TopSelling from '../components/TopSelling';
import BrowseByCategory from '../components/BrowseByCategory';
import CustomerReviews from '../components/CustomerReviews';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <NewArrivals />
      <TopSelling />
      <BrowseByCategory />
      <CustomerReviews />
    </div>
  );
};

export default Home;
