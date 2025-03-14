import AsyncStorage from "@react-native-async-storage/async-storage";

const Storage = {
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving data to AsyncStorage (key: ${key}):`, error);
    }
  },

  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error fetching data from AsyncStorage (key: ${key}):`, error);
      return null;
    }
  },


  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data from AsyncStorage (key: ${key}):`, error);
    }
  },

  clearStorage: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      console.log("All data cleared from AsyncStorage");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  }
};

export default Storage;
