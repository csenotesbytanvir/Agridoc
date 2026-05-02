export const populateDemoData = () => {
  const plants = [];
  for (let i = 0; i < 50; i++) {
    plants.push({
      id: `p${i}`,
      name: `Demo Plant ${i}`,
      scientificName: `Botanica demoica ${i}`,
      season: i % 2 === 0 ? 'Summer' : 'Winter',
      difficulty: 'easy',
      type: 'vegetable',
      watering: 'Regular',
      sunlight: 'Full Sun',
      soilPh: '6.5',
      diseases: ['Leaf Spot', 'Rust'],
      companionPlants: ['Marigold'],
      image: `https://picsum.photos/seed/plant${i}/200`,
      description: 'A beautiful demonstration plant for AgriDoc.'
    });
  }
  localStorage.setItem('agri_plants', JSON.stringify(plants));

  const marketplace = [];
  for (let i = 0; i < 30; i++) {
    marketplace.push({
      id: `m${i}`,
      type: i % 2 === 0 ? 'sell' : 'buy',
      title: i % 2 === 0 ? `Fresh Crop ${i}` : `Looking for Seed ${i}`,
      price: Math.floor(Math.random() * 500) + 50,
      quantity: `${Math.floor(Math.random() * 100)}kg`,
      location: 'Demo Region',
      seller: 'Demo Farmer',
      image: `https://picsum.photos/seed/market${i}/200`,
      blockchainHash: Math.random().toString(36).substr(2, 8),
      harvestDate: '2026-04-01',
      origin: 'Demo Farm'
    });
  }
  localStorage.setItem('agri_listings', JSON.stringify(marketplace));

  const farmgram = [];
  for (let i = 0; i < 15; i++) {
    farmgram.push({
      id: `f${i}`,
      userId: `u${i}`,
      userName: `Farmer ${i}`,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=f${i}`,
      content: 'Harvesting is going great this year! AgriDoc really helped.',
      images: [`https://picsum.photos/seed/gram${i}/400`],
      likes: Math.floor(Math.random() * 100),
      comments: [],
      createdAt: new Date().toISOString()
    });
  }
  localStorage.setItem('agri_farmgram', JSON.stringify(farmgram));
  
  localStorage.setItem('agri_points', '5500');
  localStorage.setItem('agri_started', 'true');
};
