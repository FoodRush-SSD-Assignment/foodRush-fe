// src/pages/RestaurantDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import restaurantApi from '../../api/restaurantApi';
import ItemCategorySection from '../../components/restaurant/ItemCategorySection'; // ← Updated import

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const getRestaurant = async () => {
      try {
        const res = await restaurantApi.get(`/restaurants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRestaurant(res.data);
      } catch (error) {
        console.error('Failed to fetch restaurant:', error);
      }
    };

    getRestaurant();
  }, [id]);

  if (!restaurant) {
    return <p>Loading or not found...</p>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>{restaurant.restaurantName}</h1>


      {/* Tabbed category view */}
      <ItemCategorySection restaurantId={id} />
    </div>
  );
};

export default RestaurantDetailPage;
