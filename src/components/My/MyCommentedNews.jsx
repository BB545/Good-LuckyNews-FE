import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'
import styled from 'styled-components/native';
import NewsList from './NewsList';
import api from '../../utils/common';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const MyCommentedNews = () => {
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const renderItem = ({ item }) => (
    <NewsList item={item} />
  );

  const fetchMyCommentedNews = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const response = await api.get(`/api/comments/mypage`, {
          headers: {
            'Authorization': `${token}`
          },
        });
        setNews(response.data.result);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchMyCommentedNews();
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyCommentedNews();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Container>
      <FlatList
        data={news}
        keyExtractor={(item) => item.postId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyContainer>
            <EmptyText>답글 단 소식이 없습니다.</EmptyText>
          </EmptyContainer>
        }
      />
    </Container>
  )
}

const Container = styled.View`
    flex: 1;
    padding: 10px 20px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #8A8888;
  font-family: ${(props) => props.theme.fonts.medium};
`;

export default MyCommentedNews