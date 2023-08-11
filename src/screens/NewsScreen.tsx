import React, {useState, useEffect, useCallback} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import NewsCard from '../components/NewsCard';
import {Article} from '../models/NewsApiModel';
import {fetchTop100News} from '../services/NewsServiceApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteOldNews,
  storeArticlesInAsyncStorage,
  updatePinnedNewsArticles,
} from '../services/NewsStorage';

const NewsScreen: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const refreshInterval = 30000; // 10 seconds in milliseconds
  const storageKey = 'newsArticles';

  const fetchNewNews = useCallback(async () => {
    try {
      await deleteOldNews();
      const articles = await fetchTop100News();
      await storeArticlesInAsyncStorage(articles);
      setRefreshing(false);
      setNewsArticles(articles.slice(0, 10));
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }, []);

  const fetchStoredNews = useCallback(async () => {
    try {
      const storedArticles = await AsyncStorage.getItem(storageKey);
      const storedArticlesObject: {[key: number]: Article} = storedArticles
        ? JSON.parse(storedArticles)
        : [];
      const storedNewsArticles: Article[] = Object.values(storedArticlesObject);
      const pinnedArticles = storedNewsArticles.filter(
        article => article.pinned,
      );
      const remainingArticles = storedNewsArticles
        .filter(article => !article.pinned)
        .slice(newsArticles.length);
      if (remainingArticles.length === 0) {
        fetchNewNews();
      } else {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(pinnedArticles.concat(remainingArticles)),
        );
        const updatedNewsArticles = [
          ...pinnedArticles,
          ...remainingArticles.slice(0, 10),
        ];
        const sortedArticles = sortArticles(updatedNewsArticles);
        setNewsArticles(sortedArticles);
      }
    } catch (error) {
      console.error('Error fetching stored news:', error);
    }
  }, [fetchNewNews, newsArticles.length]);

  useEffect(() => {
    fetchStoredNews();
    const intervalId = setInterval(fetchStoredNews, refreshInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStoredNews]);

  useEffect(() => {}, [newsArticles]);

  const handleDelete = async (id: number) => {
    const updatedNewsArticles = newsArticles.filter(
      article => article.id !== id,
    );
    setNewsArticles(updatedNewsArticles);
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(updatedNewsArticles),
      );
    } catch (error) {
      console.error('Error deleting news article:', error);
    }
  };

  const handlePinArticle = async (id: number) => {
    const updatedArticles = newsArticles.map(article =>
      article.id === id ? {...article, pinned: true} : article,
    );
    // Sort articles with pinned articles at the top
    const sortedArticles = sortArticles(updatedArticles);
    await updatePinnedNewsArticles(id);
    setNewsArticles(sortedArticles);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNewNews();
  };

  const sortArticles = (articles: Article[]) => {
    return [
      ...articles.filter(article => article.pinned),
      ...articles.filter(article => !article.pinned),
    ];
  };

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {newsArticles.map(article => (
          <NewsCard
            key={article.id}
            article={article}
            onDelete={handleDelete}
            handlePinArticle={handlePinArticle}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default NewsScreen;
