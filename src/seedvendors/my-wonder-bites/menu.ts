const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// Helper for salads with dual pricing
const createSaladSizes = (halfPrice: number, fullPrice: number) => [
  {
    id: "grp_size",
    name: "Size",
    type: "single",
    required: true,
    isActive: true,
    options: [
      { id: "opt_half", label: "Half", price: 0, priceType: "fixed", isAvailable: true },
      { id: "opt_full", label: "Full", price: fullPrice - halfPrice, priceType: "fixed", isAvailable: true },
    ],
  },
];

export const menuData = [
  {
    name: "🥗 Salads",
    image: u("photo-1600335895229-6e75511892c8"), // generic salad
    items: [
      {
        name: "Coleslaw Salad",
        description: "Shredded veggies cut into juliennes served with lime-mustard mayonnaise dressing and garnished with herbs & sesame seeds.",
        price: 125,
        isVeg: true,
        image: u("photo-1505253716362-afaea1d3d1af"),
        customizations: createSaladSizes(125, 200)
      },
      {
        name: "Fruit & Veg Thai Salad",
        description: "Julienne cut veggies/fruits with Thai flavoured dressing and garnished with herbs & sesame seeds.",
        price: 125,
        isVeg: true,
        image: u("photo-1505576633757-0ac1084af824"),
        customizations: createSaladSizes(125, 200)
      },
      {
        name: "Fruit Salad",
        description: "Diced fruits with choice of Thai flavoured or honey-lemon dressing.",
        price: 125,
        isVeg: true,
        image: u("photo-1512621776951-a57141f2eefd"),
        customizations: createSaladSizes(125, 200)
      },
      {
        name: "Fruit n Nut Salad",
        description: "Diced fruits with nuts and choice of Thai flavoured or honey-lemon dressing.",
        price: 150,
        isVeg: true,
        image: u("photo-1540420773420-3366772f4999"),
        customizations: createSaladSizes(150, 250)
      },
      {
        name: "Exotic Fruit Salad",
        description: "Exotic diced fruits with choice of Thai flavoured or honey-lemon dressing.",
        price: 175,
        isVeg: true,
        image: u("photo-1543339308-43e59d6b73a6"),
        customizations: createSaladSizes(175, 300)
      },
      {
        name: "Exotic Fruit n Nut Salad",
        description: "Exotic diced fruits with nuts and choice of Thai flavoured or honey-lemon dressing.",
        price: 200,
        isVeg: true,
        image: u("photo-1546069901-ba9599a7e63c"),
        customizations: createSaladSizes(200, 350)
      },
      {
        name: "Wonder Magic Mix",
        description: "Garnished with sweet corn, nuts, seeds, coconut & herbs.",
        price: 125,
        isVeg: true,
        image: u("photo-1546793665-c74683f339c1"),
        customizations: createSaladSizes(125, 225)
      },
      {
        name: "Chana Paneer (Protein Rich) Salad",
        description: "Garnished with sweet corn, nuts, seeds, coconut & herbs.",
        price: 125,
        isVeg: true,
        image: u("photo-1547496502-affa22d38842"),
        customizations: createSaladSizes(125, 200)
      }
    ]
  },
  {
    name: "🥪 Sandwiches",
    image: u("photo-1587015566802-5dc157c901cf"),
    items: [
      {
        name: "Veg Sandwich (Non-Grilled)",
        description: "Onion, tomato, cucumber, lettuce with butter and coriander chutney.",
        price: 120,
        isVeg: true,
        image: u("photo-1481070414801-51fd732d7184"),
        customizations: []
      },
      {
        name: "Coleslaw Salad Sandwich (Non-Grilled)",
        description: "Shredded cabbage, capsicum, bell pepper & onion in freshly made lime-mustard mayonnaise dressing.",
        price: 150,
        isVeg: true,
        image: u("photo-1496113269490-84ffe1a410cb"),
        customizations: []
      },
      {
        name: "Garlic Butter Grilled Sandwich",
        description: "Fusion of garlic butter and veggies with mozzarella cheese.",
        price: 170,
        isVeg: true,
        image: u("photo-1509722747041-616f39b57569"),
        customizations: []
      },
      {
        name: "Paneer Pineapple Grilled Sandwich",
        description: "Combination of paneer & pineapple with freshly made tandoori mayonnaise and mozzarella cheese.",
        price: 190,
        isVeg: true,
        image: u("photo-1528735602780-2552fd46c7af"),
        customizations: []
      },
      {
        name: "Avocado Sandwich (Non-Grilled)",
        description: "Avocado, onion, tomato, lettuce with butter, coriander chutney and mustard sauce.",
        price: 220,
        isVeg: true,
        image: u("photo-1528736235302-52922df5c122"),
        customizations: []
      }
    ]
  },
  {
    name: "🥤 Drinks & Beverages",
    image: u("photo-1541658016709-82535e94bc69"),
    items: [
      {
        name: "Apple-Beet Root Smoothie",
        description: "Apple, beetroot and carrot blended into a delicious iron-rich drink.",
        price: 150,
        isVeg: true,
        image: u("photo-1505252585461-04db1eb84625"),
        customizations: []
      },
      {
        name: "Chana Khajoor Shake",
        description: "Roasted chana, dates, milk and banana blended into a protein-rich shake.",
        price: 150,
        isVeg: true,
        image: u("photo-1553787499-6f9133860278"),
        customizations: []
      },
      {
        name: "Mango/Banana Shake",
        description: "Traditional fruit shake garnished with seeds and dry fruits.",
        price: 150,
        isVeg: true,
        image: u("photo-1568901839119-631418a3910d"),
        customizations: []
      },
      {
        name: "Saunf Badam Thandai",
        description: "Saunf and badam blended with special ingredients for a refreshing energy drink.",
        price: 150,
        isVeg: true,
        image: u("photo-1571328003758-4a3921661729"),
        customizations: []
      },
      {
        name: "Milk (Badam, Ilaichi Flavored)",
        description: "Kesar & elaichi flavoured milk garnished with badam flakes.",
        price: 120,
        isVeg: true,
        image: u("photo-1572490122747-3968b75cc699"),
        customizations: []
      },
      {
        name: "Mojito (Watermelon/Pineapple)",
        description: "Lemon and mint fusion with watermelon or pineapple for a refreshing cooler.",
        price: 120,
        isVeg: true,
        image: u("photo-1514995428455-447d4443fa7f"),
        customizations: []
      },
      {
        name: "Classic Cold Coffee",
        description: "Classic frothy iced coffee.",
        price: 120,
        isVeg: true,
        image: u("photo-1461023058943-07fcbe16d735"),
        customizations: []
      },
      {
        name: "Frappuccino Coffee",
        description: "Coffee and cream blended with ice for a thick, creamy beverage.",
        price: 150,
        isVeg: true,
        image: u("photo-1504753793650-d4a2b783c15e"),
        customizations: []
      }
    ]
  }
];
