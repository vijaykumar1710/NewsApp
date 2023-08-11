import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Article} from '../models/NewsApiModel';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {LongPressGestureHandler} from 'react-native-gesture-handler';

interface NewsCardProps {
  article: Article;
  onDelete: (id: number) => void;
  handlePinArticle: (id: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onDelete,
  handlePinArticle,
}) => {
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.swipeStyle}
      onPress={() => onDelete(article.id)}>
      <Text>Delete</Text>
    </TouchableOpacity>
  );

  const handleLongPress = () => {
    handlePinArticle(article.id);
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <LongPressGestureHandler onActivated={handleLongPress}>
        <View style={[styles.card, article.pinned && styles.pinnedCard]}>
          <Image source={{uri: article.urlToImage}} style={styles.image} />
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.description}>{article.description}</Text>
        </View>
      </LongPressGestureHandler>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'lightgrey',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    elevation: 5,
  },
  pinnedCard: {
    backgroundColor: 'red',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
  },
  swipeStyle: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsCard;
