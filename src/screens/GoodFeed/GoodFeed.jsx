import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from '../../theme/color';
import FeedList from '../../components/Feed/FeedList';
import CategoryButton from '../../components/CategoryButton/CategoryButton';
import { CustomAlert } from '../../components';
import * as SecureStore from 'expo-secure-store';
import api from '../../utils/common';

const GoodFeed = () => {
  const [posts, setPosts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const category = ['전체', '감동적', '선행', '기부', '행복', '봉사활동', '따뜻한', '치유', '웰빙', '(선한)영향력', '기여/이바지', '혁신', '힐링', '성과', '영웅', '향상'];
  const filteredPosts = selectedCategory === "전체" ? posts : posts.filter(post => post.keywords === selectedCategory);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const response = await api.get(`/article`, {
            headers: {
              'Authorization': `${token}`
            }
          });
          setPosts(response.data.result);
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchPost();
  }, []);

  const handleShowToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const renderItem = ({ item }) => (
    <FeedList item={item} showToast={handleShowToast} />
  );

  return (
    <Container>
      <CustomAlert
        message={toastMessage}
        visible={toastVisible}
        backgroundColor={COLORS.MainYellow}
        duration={1500}
        onHide={() => setToastVisible(false)}
      />
      <InnerContainer>
        <StyledText>긍정 피드</StyledText>
        <CategoryWrapper>
          <CategoryArea
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 0 }}
          >
            {category.map((item) => (
              <CategoryButton
                key={item}
                category={item}
                clicked={selectedCategory === item}
                onPress={() => setSelectedCategory(item)}
              />
            ))}
          </CategoryArea>
        </CategoryWrapper>
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, }}
        />
      </InnerContainer>
    </Container>
  )
}

const Container = styled.View`
    flex: 1;
    background-color: ${COLORS.White};
`;

const InnerContainer = styled.View`
  flex: 1;
  padding: 25px 20px;
`;

const StyledText = styled.Text`
  font-size: 22px;
  font-family: ${(props) => props.theme.fonts.medium};
  padding-bottom: 20px;
`;

const CategoryWrapper = styled.View`
  height: 26px;
  margin-bottom: 10px;
`;

const CategoryArea = styled.ScrollView`
  flex-direction: row;
`;

export default GoodFeed