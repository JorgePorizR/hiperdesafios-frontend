export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Frutas y Verduras",
    slug: "frutas-verduras",
    icon: "🍎"
  },
  {
    id: 2,
    name: "Carnes",
    slug: "carnes",
    icon: "🥩"
  },
  {
    id: 3,
    name: "Lácteos",
    slug: "lacteos",
    icon: "🥛"
  },
  {
    id: 4,
    name: "Panadería",
    slug: "panaderia",
    icon: "🍞"
  },
  {
    id: 5,
    name: "Bebidas",
    slug: "bebidas",
    icon: "🥤"
  },
  {
    id: 6,
    name: "Limpieza",
    slug: "limpieza",
    icon: "🧹"
  },
  {
    id: 7,
    name: "Congelados",
    slug: "congelados",
    icon: "❄️"
  },
  {
    id: 8,
    name: "Mascotas",
    slug: "mascotas",
    icon: "🐾"
  }
];