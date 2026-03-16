export interface Dish {
  id: string;
  name: string;
  category: "Starters" | "Mains" | "Desserts" | "Beverages";
  price: number;
  description: string;
  tags: string[];
  badge?: string;
  calories: string;
  allergens: string;
  type: "Veg" | "Non-Veg";
  gradient: string;
  modelSrc?: string; // path to GLB 3D model in /public/models/
}

export const dishes: Dish[] = [
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    category: "Mains",
    price: 495,
    description:
      "Tender tandoori chicken simmered in a rich, velvety tomato-cream sauce with aromatic spices and finished with a swirl of fresh butter.",
    tags: ["Non-Veg", "Signature"],
    badge: "Signature",
    calories: "480 kcal",
    allergens: "Dairy, Nuts",
    type: "Non-Veg",
    gradient: "linear-gradient(135deg, #C9A96E, #B08D57)",
    modelSrc: "/models/pizza.glb",
  },
  {
    id: "hyderabadi-biryani",
    name: "Hyderabadi Biryani",
    category: "Mains",
    price: 575,
    description:
      "Fragrant basmati rice layered with slow-cooked spiced lamb, caramelized onions, saffron, and fresh mint. Sealed and dum-cooked to perfection.",
    tags: ["Non-Veg", "Chef's Special"],
    badge: "Chef's Special",
    calories: "620 kcal",
    allergens: "Nuts",
    type: "Non-Veg",
    gradient: "linear-gradient(135deg, #B08D57, #B5727E)",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    category: "Starters",
    price: 395,
    description:
      "Cubes of fresh cottage cheese marinated in hung curd and charcoal-grilled with bell peppers, onions, and house-blend tikka masala.",
    tags: ["Vegetarian", "Popular"],
    badge: "Popular",
    calories: "340 kcal",
    allergens: "Dairy",
    type: "Veg",
    gradient: "linear-gradient(135deg, #C9A96E, #B08D57)",
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    category: "Mains",
    price: 345,
    description:
      "Black lentils and kidney beans slow-simmered for 12 hours with tomatoes, cream, and butter. The ultimate comfort dal.",
    tags: ["Vegetarian", "Signature"],
    badge: "Signature",
    calories: "380 kcal",
    allergens: "Dairy",
    type: "Veg",
    gradient: "linear-gradient(135deg, #8BA88E, #7B9BB5)",
  },
  {
    id: "truffle-risotto",
    name: "Truffle Risotto",
    category: "Mains",
    price: 695,
    description:
      "Arborio rice slowly stirred with aged parmesan, wild mushrooms, and finished with a generous shaving of black truffle and truffle oil.",
    tags: ["Vegetarian", "Premium"],
    badge: "Premium",
    calories: "520 kcal",
    allergens: "Dairy, Gluten",
    type: "Veg",
    gradient: "linear-gradient(135deg, #9B8EC4, #B5727E)",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    category: "Desserts",
    price: 345,
    description:
      "Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with Valrhona cocoa. Made fresh daily.",
    tags: ["Vegetarian", "Popular"],
    badge: "Popular",
    calories: "420 kcal",
    allergens: "Dairy, Gluten, Eggs",
    type: "Veg",
    gradient: "linear-gradient(135deg, #A39171, #C9A96E)",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "Desserts",
    price: 245,
    description:
      "Soft, golden milk-solid dumplings soaked in warm rose-cardamom syrup. Served with a quenelle of rabri ice cream.",
    tags: ["Vegetarian"],
    calories: "360 kcal",
    allergens: "Dairy, Nuts",
    type: "Veg",
    gradient: "linear-gradient(135deg, #B08D57, #C9A96E)",
  },
  {
    id: "masala-chai-latte",
    name: "Masala Chai Latte",
    category: "Beverages",
    price: 195,
    description:
      "Single-estate Assam tea brewed with fresh ginger, cardamom, and cinnamon. Steamed with whole milk and a touch of jaggery.",
    tags: ["Vegetarian"],
    calories: "180 kcal",
    allergens: "Dairy",
    type: "Veg",
    gradient: "linear-gradient(135deg, #C9A96E, #A39171)",
  },
];

export const categories = ["All", "Starters", "Mains", "Desserts", "Beverages"] as const;
