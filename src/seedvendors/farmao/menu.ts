const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const menuData = [
  {
    name: "🥟 Momos",
    image: u("photo-1769610712810-ec91babfccd3"),
    items: [
      {
        name: "Steamed Veg Momos",
        description: "Soft steamed veg momos.",
        price: 69,
        isVeg: true,
        image: u("photo-1496116218417-1a781b1c416c"),
        customizations: [
          {
            id: "grp_size",
            name: "Size",
            type: "single",
            required: true,
            isActive: true,
            options: [
              { id: "opt_4", label: "4 pcs", price: 0, priceType: "fixed", isAvailable: true },
              { id: "opt_8", label: "8 pcs", price: 60, priceType: "fixed", isAvailable: true },
            ],
          },
        ],
      },
      {
        name: "Paneer Steamed Momos",
        description: "Steamed momos filled with soft paneer.",
        price: 75,
        isVeg: true,
        image: u("photo-1523905330026-b8bd1f5f320e"),
        customizations: [
          {
            id: "grp_size2",
            name: "Size",
            type: "single",
            required: true,
            isActive: true,
            options: [
              { id: "opt_4_2", label: "4 pcs", price: 0, priceType: "fixed", isAvailable: true },
              { id: "opt_8_2", label: "8 pcs", price: 74, priceType: "fixed", isAvailable: true },
            ],
          },
        ],
      },
      {
        name: "Fried Crunchy Veg Momos (8 pcs)",
        description: "Crispy fried veggie momos.",
        price: 139,
        isVeg: true,
        image: u("photo-1638502338747-f7f368214cce"),
        customizations: [],
      },
      {
        name: "Fried Crunchy Paneer Momos",
        description: "Golden fried crunchy paneer momos.",
        price: 80,
        isVeg: true,
        image: u("photo-1638502521795-89107ac5e246"),
        customizations: [
          {
            id: "grp_size3",
            name: "Size",
            type: "single",
            required: true,
            isActive: true,
            options: [
              { id: "opt_4_3", label: "4 pcs", price: 0, priceType: "fixed", isAvailable: true },
              { id: "opt_8_3", label: "8 pcs", price: 79, priceType: "fixed", isAvailable: true },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "🍕 Pizza (8\" & 10\")",
    image: u("photo-1565299624946-b28f40a0ae38"),
    items: [
      { name: "Margherita Pizza", description: "Classic cheese and tomato base pizza.", price: 199, isVeg: true, image: u("photo-1513104890138-7c749659a591") },
      { name: "Golden Fresh Supreme Pizza", description: "Loaded with golden corn and fresh veggies.", price: 249, isVeg: true, image: u("photo-1534308983496-4fabb1a015ee") },
      { name: "Corn & Capsicum Carnival Pizza", description: "Sweet corn and crunchy capsicum pizza.", price: 249, isVeg: true, image: u("photo-1555072956-7758afb20e8f") },
      { name: "Paneer Overload Delight Pizza", description: "Overloaded paneer special pizza.", price: 299, isVeg: true, image: u("photo-1565299624946-b28f40a0ae38") },
      { name: "Farmao Special Pizza", description: "Our chef's signature loaded pizza.", price: 299, isVeg: true, image: u("photo-1571066811602-716837d681de") },
    ],
  },
  {
    name: "🍝 Pasta & Continental",
    image: u("photo-1528735602780-2552fd46c7af"),
    items: [
      { name: "Red Arrabiata Pasta", description: "Tangy and spicy red tomato sauce pasta.", price: 249, isVeg: true, image: u("photo-1473093226795-af9932fe5856") },
      { name: "Creamy White Cloud Pasta", description: "Rich and creamy white sauce pasta.", price: 299, isVeg: true, image: u("photo-1516100882582-96c3a05fe590") },
      { name: "Pink Fusion Pasta", description: "Perfect blend of red and white sauces.", price: 299, isVeg: true, image: u("photo-1546549032-9571cd6b27df") },
    ],
  },
  {
    name: "🥖 Garlic Breads",
    image: u("photo-1573140247632-f8fd74997d5c"),
    items: [
      { name: "Farmao Classic Garlic Bread", description: "Freshly baked garlic bread.", price: 199, isVeg: true, image: u("photo-1556008531-57e6eefc7be4") },
      { name: "Corn & Cheese Garlic Bread", description: "Garlic bread with sweet corn and cheese.", price: 199, isVeg: true, image: u("photo-1558679582-7fe9071024c9") },
      { name: "Tandoori Paneer Stuffed Garlic Bread", description: "Stuffed with spicy tandoori paneer.", price: 249, isVeg: true, image: u("photo-1573140401552-3fab0b24306f") },
    ],
  },
  {
    name: "🍔 Burgers",
    image: u("photo-1568901346375-23c9450c58cd"),
    items: [
      { name: "Cheese Burst Veggie Burger", description: "Veggie patty overflowing with cheese.", price: 149, isVeg: true, image: u("photo-1530554764233-e79e16c91d08") },
      { name: "Masala Crunch Burger", description: "Spicy and crunchy masala patty burger.", price: 139, isVeg: true, image: u("photo-1549611016-3a70d82b5040") },
      { name: "Tandoori Paneer King Burger", description: "Burger with a large tandoori paneer slab.", price: 199, isVeg: true, image: u("photo-1550547660-d9450f859349") },
      { name: "Double Decker Veg Classic Burger", description: "Two veg patties, double the fun.", price: 199, isVeg: true, image: u("photo-1551782450-a2132b4ba21d") },
    ],
  },
  {
    name: "🍟 Fries",
    image: u("photo-1576107232684-1279f3908594"),
    items: [
      { name: "Classic Golden Salted Fries", description: "Crispy salted french fries.", price: 129, isVeg: true, image: u("photo-1518013431117-eb1465fa5752") },
      { name: "Peri Peri Thunder Fries", description: "Fries tossed in spicy peri peri.", price: 159, isVeg: true, image: u("photo-1541592106381-b31e9677c0e5") },
      { name: "Cheese Loaded Fries", description: "Fries smothered in liquid cheese.", price: 199, isVeg: true, image: u("photo-1582762147076-6d985d99975a") },
      { name: "Peri Peri with Cheese Fries", description: "Spicy peri peri and creamy cheese fries.", price: 199, isVeg: true, image: u("photo-1573080496219-bb080dd4f877") },
    ],
  },
  {
    name: "🥔 Chinese Mainland",
    image: u("photo-1585032226651-759b368d7246"),
    items: [
      { name: "Garlic Chilli Potato", description: "Potatoes tossed in garlic chilli sauce.", price: 199, isVeg: true, image: u("photo-1526318896980-cf78c088247c") },
      { name: "Honey Chilli Potato", description: "Sweet and spicy honey glazed potatoes.", price: 249, isVeg: true, image: u("photo-1530569112985-108dc2578ec2") },
      { name: "Smoky Tossed Chilli Mushrooms", description: "Mushrooms wok-tossed with smoky flavors.", price: 299, isVeg: true, image: u("photo-1499638673689-79a0b5115d87") },
      { name: "Schezwan Tossed Chilli Paneer", description: "Spicy paneer chunks in schezwan sauce.", price: 299, isVeg: true, image: u("photo-1527761939622-9119094630cf") },
    ],
  },
  {
    name: "🌯 Spring Rolls",
    image: u("photo-1544025162-d76694265947"),
    items: [
      { name: "Farmao Classic Veg Spring Rolls", description: "Crispy rolls stuffed with fresh veggies.", price: 149, isVeg: true, image: u("photo-1600850056064-a8b380df8395") },
    ],
  },
  {
    name: "☕ Cold Coffee & Shakes",
    image: u("photo-1541658016709-82535e94bc69"),
    items: [
      { name: "Classic Cold Coffee", description: "Refreshing classic cold brewed coffee.", price: 199, isVeg: true, image: u("photo-1461023058943-07fcbe16d735") },
      { name: "Vanilla Dream Shake", description: "Creamy vanilla milkshake.", price: 199, isVeg: true, image: u("photo-1504753793650-d4a2b783c15e") },
      { name: "Nutella Magic Shake", description: "Thick shake blended with real Nutella.", price: 249, isVeg: true, image: u("photo-1517701550927-30cf4ba1dba5") },
      { name: "KitKat Blast Shake", description: "Crunchy KitKat pieces in chocolate shake.", price: 249, isVeg: true, image: u("photo-1527156231393-7023794f363c") },
      { name: "Oreo Crush Shake", description: "Classic Oreo cookie shake.", price: 249, isVeg: true, image: u("photo-1533007716222-4b465613a984") },
    ],
  },
  {
    name: "🍹 Mocktails",
    image: u("photo-1600271886742-f049cd451bba"),
    items: [
      { name: "Virgin Mojito Sparkle", description: "Classic mint and lime refreshing drink.", price: 149, isVeg: true, image: u("photo-1595981267035-7b04ca84a82d") },
      { name: "Blue Lagoon Wave Mocktail", description: "Tropical blue curacao cooler.", price: 149, isVeg: true, image: u("photo-1608962994022-8f18c30a7c8c") },
      { name: "Mango Mint Refresher", description: "Sweet mango with a hint of fresh mint.", price: 149, isVeg: true, image: u("photo-1610515660473-c11d4f3f7d37") },
      { name: "Green Apple Fizz Mocktail", description: "Crisp and bubbly green apple drink.", price: 149, isVeg: true, image: u("photo-1619604394865-437a9fd6853c") },
      { name: "Kiwi Cooler Pop Mocktail", description: "Tangy and sweet kiwi cooler.", price: 149, isVeg: true, image: u("photo-1634496064950-02f043806b09") },
      { name: "Orange Sunrise Twist Mocktail", description: "Citrusy orange mocktail.", price: 149, isVeg: true, image: u("photo-1654074517750-f854f7c27d62") },
    ],
  },
  {
    name: "☕ Hot Beverages",
    image: u("photo-1571934811356-5cc061b6821f"),
    items: [
      { name: "Farmao Special Hot Chocolate", description: "Rich, creamy, and decadent hot chocolate.", price: 149, isVeg: true, image: u("photo-1654074518423-750767f571a9") },
    ],
  },
  {
    name: "⭐ Chef's Picks",
    image: u("photo-1565299624946-b28f40a0ae38"),
    items: [
      { name: "Creamy White Cloud Pasta", description: "Rich and creamy white sauce pasta.", price: 299, isVeg: true, image: u("photo-1516100882582-96c3a05fe590") },
      { name: "Farmao Special Pizza", description: "Our chef's signature loaded pizza.", price: 299, isVeg: true, image: u("photo-1571066811602-716837d681de") },
      { name: "Masala Crunch Burger", description: "Spicy and crunchy masala patty burger.", price: 139, isVeg: true, image: u("photo-1549611016-3a70d82b5040") },
      { name: "Corn & Cheese Garlic Bread", description: "Garlic bread with sweet corn and cheese.", price: 199, isVeg: true, image: u("photo-1558679582-7fe9071024c9") },
      { name: "Oreo Crush Shake", description: "Classic Oreo cookie shake.", price: 249, isVeg: true, image: u("photo-1533007716222-4b465613a984") },
    ],
  },
  {
    name: "🥣 Extras",
    image: u("photo-1601050690597-df0568f70950"),
    items: [
      { name: "Cheesy Dip", description: "Extra side of cheesy dip.", price: 20, isVeg: true, image: u("photo-1533036126113-bed9f8f00b33") },
      { name: "Tandoori Dip", description: "Spicy tandoori flavored dip.", price: 20, isVeg: true, image: u("photo-1603360946369-dc9bb6258143") },
      { name: "Chipotle Dip", description: "Smoky chipotle mayo dip.", price: 20, isVeg: true, image: u("photo-1623316405245-8418193f2fc0") },
      { name: "Salsa Dip", description: "Tangy tomato salsa dip.", price: 20, isVeg: true, image: u("photo-1626323107927-008ae2828ab6") },
    ],
  },
  {
    name: "🍗 Non-Veg",
    image: u("photo-1623341214825-9f4f963727da"),
    items: [
      { name: "Chicken Nuggets", description: "Crispy bite-sized chicken nuggets.", price: 249, isVeg: false, image: u("photo-1585109649139-366815a0d713") },
    ],
  },
];