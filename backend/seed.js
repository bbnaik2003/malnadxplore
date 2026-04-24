const mongoose = require('mongoose');
const User = require('./models/User');
const Trip = require('./models/Trip');
require('dotenv').config();

const TRIPS = [
  {
    title: 'Kudremukh Peak Trek 3D',
    location: 'Kudremukh, Chikmagalur, Karnataka',
    description: 'Trek through UNESCO-listed Kudremukh National Park — one of the most biodiverse spots on earth. The shola-grassland mosaic, misty ridgelines, and the iconic horse-face peak make this a bucket-list Malnad experience. Spot gaur, hornbills, and if lucky, a clouded leopard.',
    price: 7500,
    duration: 3,
    maxTravelers: 15,
    tags: ['Trek', 'UNESCO', 'Wildlife', 'Shola Forest', 'Chikmagalur'],
    schedule: [
      { day:1, activities:'Arrive Kalpetta base, briefing, acclimatization walk through coffee estate', time:'2:00 PM' },
      { day:2, activities:'Full-day summit trek — 22km round trip to Kudremukh peak (1894m), packed lunch on ridge', time:'5:30 AM' },
      { day:3, activities:'Sunrise at Gangamoola, Bhadra river origin visit, return to base, departure', time:'6:00 AM' },
    ],
  },
  {
    title: 'Agumbe Rainforest Monsoon Trek 2D',
    location: 'Agumbe, Shivamogga, Karnataka',
    description: 'Agumbe — the Cherrapunji of the South. Walk through dripping rainforests, discover the world\'s longest venomous snake (King Cobra research station), catch the famous Agumbe sunset, and explore the set of Malgudi Days. A pure monsoon magic experience.',
    price: 4500,
    duration: 2,
    maxTravelers: 12,
    tags: ['Rainforest', 'Monsoon', 'Wildlife', 'Heritage', 'Shivamogga'],
    schedule: [
      { day:1, activities:'Arrive Agumbe, ARRS King Cobra research centre visit, sunset point, firefly walk', time:'12:00 PM' },
      { day:2, activities:'Barkana Falls trek (850m high waterfall), Onake Abbi falls, Kundadri hill viewpoint, departure', time:'6:00 AM' },
    ],
  },
  {
    title: 'Chikmagalur Coffee Trail & Mullayanagiri 4D',
    location: 'Chikmagalur, Karnataka',
    description: 'Karnataka\'s coffee capital and home to Mullayanagiri — the highest peak in the state at 1930m. Walk through coffee, cardamom and pepper estates, stay in a heritage planter\'s bungalow, trek to the summit, and drive the legendary Z-point road.',
    price: 9800,
    duration: 4,
    maxTravelers: 16,
    tags: ['Coffee', 'Trek', 'Heritage Stay', 'Highest Peak', 'Chikmagalur'],
    schedule: [
      { day:1, activities:'Arrive Chikmagalur, coffee estate guided walk, plucking experience, bonfire dinner', time:'1:00 PM' },
      { day:2, activities:'Mullayanagiri summit trek (1930m), Bababudangiri hills, Dattagiri shrine, sunset', time:'5:30 AM' },
      { day:3, activities:'Hebbe Falls trek, Kemmangundi rose garden, Z-Point via road, sunset terrace', time:'7:00 AM' },
      { day:4, activities:'Coffee processing factory tour, buy estate coffee, Hirekolale lake, departure', time:'8:00 AM' },
    ],
  },
  {
    title: 'Jog Falls & Yana Rock Formations 3D',
    location: 'Jog Falls & Yana, Uttara Kannada, Karnataka',
    description: 'India\'s second-highest plunge waterfall (253m) combined with the eerily beautiful Yana rock formations — two of Karnataka\'s most spectacular natural wonders, just 50km apart. Swim in natural pools, trek to Vibhuti Falls, and witness Jog in full monsoon fury.',
    price: 6200,
    duration: 3,
    maxTravelers: 18,
    tags: ['Waterfall', 'Rock Formations', 'Nature', 'Swim', 'Uttara Kannada'],
    schedule: [
      { day:1, activities:'Arrive Sagar, Sigandur temple by boat crossing, riverside camp setup, bonfire', time:'11:00 AM' },
      { day:2, activities:'Jog Falls full experience — Raja, Rani, Rover, Rocket falls, natural pool swim', time:'7:00 AM' },
      { day:3, activities:'Yana rock formations trek (2km), Vibhuti Falls hidden pool, Gokarna detour option', time:'6:30 AM' },
    ],
  },
  {
    title: 'Coorg Spice Forest & Abbey Falls 5D',
    location: 'Madikeri, Kodagu, Karnataka',
    description: 'The Scotland of India — Coorg\'s rolling hills covered in coffee, pepper, and cardamom. Trek through misty trails, visit Nagarhole tiger reserve, taste fresh estate coffee, witness Abbey Falls in full flow, and experience Kodava culture and cuisine.',
    price: 12500,
    duration: 5,
    maxTravelers: 14,
    tags: ['Coorg', 'Spice Estate', 'Tiger Reserve', 'Culture', 'Coffee'],
    schedule: [
      { day:1, activities:'Arrive Madikeri, Raja\'s Seat sunset, Omkareshwara temple, Kodava dinner', time:'2:00 PM' },
      { day:2, activities:'Abbey Falls, Iruppu Falls trek, Brahmagiri peak viewpoint, coffee estate walk', time:'7:00 AM' },
      { day:3, activities:'Nagarhole National Park jeep safari — tigers, elephants, gaur, hornbills', time:'5:30 AM' },
      { day:4, activities:'Talacauvery origin of Kaveri river, Bhagamandala, Nisargadhama bamboo island', time:'7:00 AM' },
      { day:5, activities:'Spice plantation tour, buy organic spices, Dubare elephant camp, departure', time:'8:00 AM' },
    ],
  },
  {
    title: 'Bisle Ghat & Pushpagiri Wildlife Sanctuary 3D',
    location: 'Bisle Ghat, Hassan–Dakshina Kannada, Karnataka',
    description: 'Bisle Ghat Viewpoint offers a panoramic 3-Western-Ghats-peak view that rivals anything in South India. Combined with Pushpagiri Wildlife Sanctuary — one of Karnataka\'s least visited gems — this is for those who want true wilderness away from tourist crowds.',
    price: 5800,
    duration: 3,
    maxTravelers: 10,
    tags: ['Hidden Gem', 'Wildlife', 'Viewpoint', 'Offbeat', 'Western Ghats'],
    schedule: [
      { day:1, activities:'Drive to Bisle via Sakleshpur, check-in forest guesthouse, evening bird walk', time:'12:00 PM' },
      { day:2, activities:'Bisle viewpoint sunrise, Pushpagiri peak trek (1714m), Kumara Parvatha trail section', time:'4:30 AM' },
      { day:3, activities:'Hornbill nest-watching walk, Sakleshpur coffee village, Manjarabad star fort, departure', time:'6:30 AM' },
    ],
  },
  {
    title: 'Sakleshpur Heritage Railway & Trek 2D',
    location: 'Sakleshpur, Hassan, Karnataka',
    description: 'Walk the legendary Sakleshpur–Subramanya railway track through 52 tunnels and 107 bridges cut through thick Western Ghats jungle. This is one of the most iconic railway heritage trail walks in India, passing through waterfalls, bridges and shola forest.',
    price: 3200,
    duration: 2,
    maxTravelers: 20,
    tags: ['Railway Trek', 'Heritage', 'Bridges', 'Tunnels', 'Sakleshpur'],
    schedule: [
      { day:1, activities:'Arrive Sakleshpur, acclimatization walk, route briefing, local Malnad dinner', time:'3:00 PM' },
      { day:2, activities:'Full-day railway track walk 18km — 52 tunnels, waterfalls, 107 bridges, return by afternoon', time:'6:00 AM' },
    ],
  },
  {
    title: 'Bhadra Tiger Reserve Wilderness Camp 4D',
    location: 'Bhadra Wildlife Sanctuary, Chikmagalur, Karnataka',
    description: 'A Project Tiger reserve with the second-highest tiger density in Karnataka. Stay inside the buffer zone, take jeep safaris at dawn and dusk, boat safari on Bhadra reservoir, and trek through the sanctuary with armed forest guards. Genuine wilderness immersion.',
    price: 16500,
    duration: 4,
    maxTravelers: 8,
    tags: ['Tiger Reserve', 'Safari', 'Camp', 'Wildlife', 'Bhadra'],
    schedule: [
      { day:1, activities:'Arrive Bhadra, wilderness camp setup, evening boat safari on reservoir', time:'1:00 PM' },
      { day:2, activities:'Dawn jeep safari, birds & mammals, breakfast by river, nature walk with naturalist', time:'5:00 AM' },
      { day:3, activities:'Full-day trek inside sanctuary with armed guard, elephant trail, tiger pugmarks', time:'6:00 AM' },
      { day:4, activities:'Final dawn safari, Shettihalli church ruins (submerged), departure', time:'5:30 AM' },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    await User.deleteMany({});
    await Trip.deleteMany({});
    console.log('🧹 Cleared existing data');

    const admin = await User.create({
      name: 'MalnadXplore Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👑 Admin created: admin@demo.com / admin123');

    await User.create({
      name: 'Demo Explorer',
      email: 'user@demo.com',
      password: 'demo123',
      role: 'user',
    });
    console.log('👤 Demo user created: user@demo.com / demo123');

    for (const t of TRIPS) {
      await Trip.create({ ...t, createdBy: admin._id });
    }
    console.log(`🌿 Created ${TRIPS.length} Malnad expeditions`);

    console.log('\n✅ MalnadXplore database seeded!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin : admin@demo.com  / admin123');
    console.log('👤 User  : user@demo.com   / demo123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
