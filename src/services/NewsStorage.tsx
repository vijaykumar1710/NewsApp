import AsyncStorage from '@react-native-async-storage/async-storage';
import {Article} from '../models/NewsApiModel';

const storageKey = 'newsArticles';

export const storeArticlesInAsyncStorage = async (articles: Article[]) => {
  try {
    const articlesObject: {[key: number]: Article} = {};
    articles.forEach(article => {
      articlesObject[article.id] = article;
    });
    await AsyncStorage.setItem(storageKey, JSON.stringify(articlesObject));
  } catch (error) {
    console.error('Error storing articles:', error);
  }
};

export const deleteArticleFromAsyncStorage = async (id: number) => {
  try {
    const storedArticles = await AsyncStorage.getItem(storageKey);
    if (storedArticles != null) {
      const storedArticlesObject: {[key: number]: Article} =
        JSON.parse(storedArticles);
      delete storedArticlesObject[id];
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(storedArticlesObject),
      );
    }
  } catch (error) {
    console.error('Error deleting article:', error);
  }
};

export const updatePinnedNewsArticles = async (id: number) => {
  try {
    const storedArticles = await AsyncStorage.getItem(storageKey);
    if (storedArticles != null) {
      const storedArticlesObject: {[key: number]: Article} =
        JSON.parse(storedArticles);
      const updatedArticlesObject = {
        ...storedArticlesObject,
        [id]: {
          ...storedArticlesObject[id],
          pinned: true,
        },
      };
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(updatedArticlesObject),
      );
    }
  } catch (error) {
    console.error('Error updating article:', error);
  }
};

export const deleteOldNews = async () => {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify([]));
  } catch (error) {
    console.error('Error deleting old news:', error);
  }
};
