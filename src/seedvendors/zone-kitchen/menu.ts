const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const createHalfFull = (halfPrice: number, fullPrice: number) => [
  {
    id: "grp_size_hf",
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

const createQtrHalfFull = (qtrPrice: number, halfPrice: number, fullPrice: number) => [
  {
    id: "grp_size_qhf",
    name: "Size",
    type: "single",
    required: true,
    isActive: true,
    options: [
      { id: "opt_qtr", label: "Qtr", price: 0, priceType: "fixed", isAvailable: true },
      { id: "opt_half", label: "Half", price: halfPrice - qtrPrice, priceType: "fixed", isAvailable: true },
      { id: "opt_full", label: "Full", price: fullPrice - qtrPrice, priceType: "fixed", isAvailable: true },
    ],
  },
];

export const menuData = [
  {
    name: "🥦 Veg Starters",
    image: u("photo-1517244683847-7456b63c5969"),
    items: [
      { name: "Paneer Tikka", description: "", price: 260, isVeg: true, image: u("photo-1567188040759-fb8a883dc6d8"), customizations: [] },
      { name: "Achari Paneer Tikka", description: "", price: 280, isVeg: true, image: u("photo-1631452180519-c014fe946bc7"), customizations: [] },
      { name: "Tandoori Soya Chaap", description: "", price: 270, isVeg: true, image: u("photo-1631452180539-96aca7d48617"), customizations: [] },
      { name: "Malai Soya Chaap", description: "", price: 300, isVeg: true, image: u("photo-1666001120694-3ebe8fd207be"), customizations: [] },
      { name: "Mushroom Tikka", description: "", price: 270, isVeg: true, image: u("photo-1690369642707-3d30e6f7fdcb"), customizations: [] },
      { name: "Stuffed Mushroom Tikka", description: "", price: 300, isVeg: true, image: u("photo-1690369642866-3f9143af0a89"), customizations: [] },
      { name: "Chilli Paneer", description: "", price: 350, isVeg: true, image: u("photo-1690401767645-595de0e0e5f8"), customizations: [] },
      { name: "Chilli Mushroom", description: "", price: 380, isVeg: true, image: u("photo-1690401769082-5f475f87fb22"), customizations: [] }
    ]
  },
  {
    name: "🍗 Non-Veg Starters",
    image: u("photo-1574484284002-952d92456975"),
    items: [
      { name: "Chicken Seekh Kabab", description: "", price: 330, isVeg: false, image: u("photo-1555939594-58d7cb561ad1"), customizations: [] },
      { name: "Mutton Seekh Kabab", description: "", price: 420, isVeg: false, image: u("photo-1565557623262-b51c2513a641"), customizations: [] },
      { name: "Surmai Fish Tikka", description: "", price: 600, isVeg: false, image: u("photo-1599487488170-d11ec9c172f0"), customizations: [] },
      { name: "Tandoori Chicken", description: "", price: 280, isVeg: false, image: u("photo-1603894584373-5ac82b2ae398"), customizations: createHalfFull(280, 480) },
      { name: "Afghani Chicken", description: "", price: 320, isVeg: false, image: u("photo-1605908580297-f3e1c02e64ff"), customizations: createHalfFull(320, 540) },
      { name: "Drums of Heaven (5/8)", description: "", price: 290, isVeg: false, image: u("photo-1610057099431-d73a1c9d2f2f"), customizations: createHalfFull(290, 450) },
      { name: "Chicken Tikka (Thigh)", description: "", price: 380, isVeg: false, image: u("photo-1610057099443-fde8c4d50f91"), customizations: [] },
      { name: "Murgh Peshawari (Thigh)", description: "", price: 400, isVeg: false, image: u("photo-1652545296821-09a023a9fd08"), customizations: [] },
      { name: "Kasuri Malai Murgh (Thigh)", description: "", price: 400, isVeg: false, image: u("photo-1652545296882-cf7f118c4df5"), customizations: [] },
      { name: "Achari Murgh Tikka (Thigh)", description: "", price: 400, isVeg: false, image: u("photo-1687020835890-b0b8c6a04613"), customizations: [] },
      { name: "Pudhina Chicken Tikka (Thigh)", description: "", price: 400, isVeg: false, image: u("photo-1693820488674-4f8c98fbc0f9"), customizations: [] },
      { name: "Kali Mirch Chicken Tikka (Thigh)", description: "", price: 400, isVeg: false, image: u("photo-1697155836250-e3ba3a24fbd5"), customizations: [] },
      { name: "Lehsuni Murgh Tikka (Thigh)", description: "", price: 400, isVeg: false, image: u("photo-1707448829764-9474458021ed"), customizations: [] }
    ]
  },
  {
    name: "🥘 Veg Main-Course",
    image: u("photo-1581600140682-d4e68c8cde32"),
    items: [
      { name: "Kadhai Paneer", description: "", price: 250, isVeg: true, image: u("photo-1505253758473-96b7015fcd40"), customizations: createHalfFull(250, 350) },
      { name: "Shahi Paneer", description: "", price: 250, isVeg: true, image: u("photo-1542367592-8849eb950fd8"), customizations: createHalfFull(250, 350) },
      { name: "Paneer Lababdar", description: "", price: 250, isVeg: true, image: u("photo-1567337710282-00832b415979"), customizations: createHalfFull(250, 350) },
      { name: "Paneer Butter Masala", description: "", price: 270, isVeg: true, image: u("photo-1567529854338-fc097b962123"), customizations: createHalfFull(270, 370) },
      { name: "Paneer Dhaniya Adraki", description: "", price: 270, isVeg: true, image: u("photo-1585937421612-70a008356fbe"), customizations: createHalfFull(270, 370) },
      { name: "Masala Chaap (Gravy)", description: "", price: 280, isVeg: true, image: u("photo-1596797038530-2c107229654b"), customizations: createHalfFull(280, 380) },
      { name: "Dal Makhani", description: "", price: 230, isVeg: true, image: u("photo-1606471191009-63994c53433b"), customizations: createHalfFull(230, 350) },
      { name: "Dal Tadka", description: "", price: 210, isVeg: true, image: u("photo-1627366422957-3efa9c6df0fc"), customizations: createHalfFull(210, 330) }
    ]
  },
  {
    name: "🍛 Non-Veg Main-Course",
    image: u("photo-1589301760014-d929f3979dbc"),
    items: [
      { name: "Butter Chicken", description: "", price: 300, isVeg: false, image: u("photo-1534939561126-855b8675edd7"), customizations: createQtrHalfFull(300, 450, 700) },
      { name: "Butter Chicken Boneless", description: "", price: 330, isVeg: false, image: u("photo-1588166524941-3bf61a9c41db"), customizations: createQtrHalfFull(330, 480, 740) },
      { name: "Lemon Chicken", description: "", price: 300, isVeg: false, image: u("photo-1603496987351-f84a3ba5ec85"), customizations: createQtrHalfFull(300, 450, 700) },
      { name: "Kadhai Chicken", description: "", price: 320, isVeg: false, image: u("photo-1604908176997-125f25cc6f3d"), customizations: createQtrHalfFull(320, 450, 700) },
      { name: "Chicken Tikka Masala (Thigh)", description: "", price: 480, isVeg: false, image: u("photo-1606843046080-45bf7a23c39f"), customizations: createHalfFull(480, 740) },
      { name: "Kali Mirch Chicken", description: "", price: 490, isVeg: false, image: u("photo-1618449840665-9ed506d73a34"), customizations: createHalfFull(490, 770) },
      { name: "Chilly Chicken Boneless", description: "", price: 370, isVeg: false, image: u("photo-1672933036331-e27ffae157bd"), customizations: createHalfFull(370, 670) },
      { name: "Mutton Rogan Josh", description: "", price: 400, isVeg: false, image: u("photo-1678969406353-ead12b1f258a"), customizations: createHalfFull(400, 680) },
      { name: "Chicken Dhaniya Adraki", description: "", price: 300, isVeg: false, image: u("photo-1708782344490-9026aaa5eec7"), customizations: createQtrHalfFull(300, 450, 700) }
    ]
  },
  {
    name: "🌯 Veg Rumali Rolls",
    image: u("photo-1589302168068-964664d93dc0"),
    items: [
      { name: "Tandoori Chaap Roll", description: "", price: 140, isVeg: true, image: u("photo-1770341990092-6a5b0e1b61c2"), customizations: [] },
      { name: "Afghani Chaap Roll", description: "", price: 160, isVeg: true, image: u("photo-1780498178879-4064b19e6517"), customizations: [] },
      { name: "Peshawari Chaap Roll", description: "", price: 160, isVeg: true, image: u("photo-1690403160225-3db8cc8babd5"), customizations: [] },
      { name: "Paneer Tikka Roll", description: "", price: 160, isVeg: true, image: u("photo-1775717427684-75b886ebbfc9"), customizations: [] },
      { name: "Mushroom Tikka Roll", description: "", price: 160, isVeg: true, image: u("photo-1777464888407-1c8cbacf7e8d"), customizations: [] }
    ]
  }
];
