import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export const AsyncData = async (key, data) => {
  const item = await AsyncStorage.setItem(key, data);
  return item;
};
export const getAsyncData = async key => {
  const getData = await AsyncStorage.getItem(key);
  return getData;
};
export const removeAsynData = async key => {
  const data = await AsyncStorage.removeItem(key);
  return data;
};
