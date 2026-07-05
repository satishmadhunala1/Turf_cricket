require('../config/env');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Turf = require('../models/Turf');

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Turf.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@turfbook.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
  });

  const owner = await User.create({
    name: 'Turf Owner',
    email: 'owner@turfbook.com',
    password: 'owner123',
    role: 'owner',
    isEmailVerified: true,
  });

  const user = await User.create({
    name: 'Demo User',
    email: 'user@turfbook.com',
    password: 'user123',
    role: 'user',
    isEmailVerified: true,
  });

  const turfs = [
    {
      name: 'Elite Cricket Arena',
      description: 'Premium turf with floodlights, professional pitch, and modern pavilion. Perfect for corporate matches and tournaments.',
      coverImage: 'https://images.pexels.com/photos/1170295/pexels-photo-1170295.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      images: [
        'https://images.pexels.com/photos/1170295/pexels-photo-1170295.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      ],
      owner: owner._id,
      sport: 'cricket',
      location: { city: 'Hyderabad', area: 'Gachibowli', address: '123 Sports Complex, Gachibowli', coordinates: { lat: 17.4401, lng: 78.3489 } },
      pricePerHour: 2500,
      size: 'Full Ground',
      amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria'],
      facilities: ['Turf Pitch', 'Nets', 'Scoreboard'],
      rating: 4.8,
      reviewCount: 124,
      isFeatured: true,
    },
    {
      name: 'Green Valley Sports Hub',
      description: 'Spacious cricket ground with excellent drainage and well-maintained outfield. Ideal for weekend leagues.',
      coverImage: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      images: ['https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
      owner: owner._id,
      sport: 'cricket',
      location: { city: 'Hyderabad', area: 'Madhapur', address: '45 IT Park Road, Madhapur', coordinates: { lat: 17.4485, lng: 78.3908 } },
      pricePerHour: 1800,
      amenities: ['Parking', 'Water', 'First Aid'],
      facilities: ['Turf Pitch', 'Boundary Rope'],
      rating: 4.5,
      reviewCount: 89,
      isFeatured: true,
    },
    {
      name: 'Striker Box Cricket',
      description: 'Indoor box cricket facility with air conditioning. Play anytime regardless of weather.',
      coverImage: 'https://images.pexels.com/photos/4195238/pexels-photo-4195238.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      images: ['https://images.pexels.com/photos/4195238/pexels-photo-4195238.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
      owner: owner._id,
      sport: 'cricket',
      location: { city: 'Bangalore', area: 'Koramangala', address: '78 5th Block, Koramangala', coordinates: { lat: 12.9352, lng: 77.6245 } },
      pricePerHour: 1200,
      amenities: ['AC', 'Parking', 'Refreshments'],
      facilities: ['Box Cricket', 'Bowling Machine'],
      rating: 4.6,
      reviewCount: 67,
      isFeatured: true,
    },
    {
      name: 'Champions Turf Ground',
      description: 'Olympic-standard cricket turf used for state-level tournaments. Book for premium match experience.',
      coverImage: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      images: ['https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
      owner: owner._id,
      sport: 'cricket',
      location: { city: 'Mumbai', area: 'Andheri', address: '22 Sports Lane, Andheri West', coordinates: { lat: 19.1197, lng: 72.8464 } },
      pricePerHour: 3500,
      amenities: ['Floodlights', 'VIP Lounge', 'Parking', 'Live Streaming'],
      facilities: ['Turf Pitch', 'Electronic Scoreboard', 'Umpire Room'],
      rating: 4.9,
      reviewCount: 203,
      isFeatured: true,
    },
  ];

  for (const turfData of turfs) {
    await Turf.create(turfData);
  }

  console.log('✅ Seed complete');
  console.log('Admin: admin@turfbook.com / admin123');
  console.log('Owner: owner@turfbook.com / owner123');
  console.log('User:  user@turfbook.com / user123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
