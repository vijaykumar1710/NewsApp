import axios from 'axios';
import {Article, NewsApiResponse} from '../models/NewsApiModel';

const API_KEY = 'f05b91800112473b9bbd715e8ddeed12';
const BASE_URL = 'https://newsapi.org/v2';

const instance = axios.create({
  baseURL: BASE_URL,
});

export const fetchTop100News = async (): Promise<Article[]> => {
  try {
    const response = await instance.get<NewsApiResponse>(
      `/everything?q=trending&apiKey=${API_KEY}`,
    );
    const articlesWithId = [];
    for (let index = 0; index < 100; index++) {
      const article = response.data.articles[index];
      articlesWithId.push({
        ...article,
        id: index,
        pinned: false,
      });
    }
    return articlesWithId;
  } catch (error) {
    console.error('Error fetching top 100 news:', error);
    throw error;
  }
};
