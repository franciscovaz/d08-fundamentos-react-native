import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const productsStored = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (productsStored) {
        setProducts([JSON.parse(productsStored)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      // ver se o produto já esta no carrinho, se sim, aumenta a quantidade

      const productIndex = products.findIndex(prod => prod.id === product.id);

      if (productIndex >= 0) {
        // já tenho, aumento quantidade
        // quantity ao inicio esta a NaN
        if (!products[productIndex].quantity) {
          products[productIndex].quantity = 0;
        }
        products[productIndex].quantity += 1;
      } else {
        setProducts([...products, product]);

        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(products),
        );
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = await products.findIndex(prod => prod.id === id);

      if (productIndex >= 0) {
        // já tenho, aumento quantidade
        products[productIndex].quantity += 1;
        // console.log('PRodutos: ', products);
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = await products.findIndex(prod => prod.id === id);

      if (productIndex >= 0) {
        products[productIndex].quantity += 1;
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
