import React, {useContext} from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {ProgressBar, Button, Card} from 'react-native-paper';
import {CheckCircle, Gift} from 'lucide-react-native';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
export default function Reward() {
  const {rewardList, currentTheme} = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Rewards</Text>
      <FlatList
        data={rewardList}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        }
        renderItem={({item}) => (
          <Card style={styles.rewardCard}>
            <Card.Content>
              <View style={styles.rewardRow}>
                <Image source={{uri: item.image}} style={styles.rewardImage} />
                <View style={styles.rewardDetails}>
                  <Text style={styles.rewardText}>{item.reward_name}</Text>
                  <Text style={styles.rewardSubText}>
                    {item.date} - {item.reward_category.name}
                  </Text>
                  <Text style={styles.rewardMessage}>{item.description}</Text>
                </View>
                <CheckCircle size={24} color="green" />
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  points: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  progress: {
    marginTop: 10,
    height: 8,
    borderRadius: 4,
  },
  subtext: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  rewardCard: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  rewardSubText: {
    fontSize: 14,
    color: 'gray',
  },
  rewardMessage: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  pointsRequired: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
});
