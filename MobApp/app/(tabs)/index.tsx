import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAssetStats, getRecentActivities } from '../../services/authService';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? darkStyles : styles;

  const [statsData, setStatsData] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
  });
  
  const [activities, setActivities] = useState([]);
  
  const fetchStats = async () => {
    try {
      const data = await getAssetStats();
      setStatsData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };
  const [refreshInterval, setRefreshInterval] = useState(5000); // 10 sec by default

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
  
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities();
        setActivities(data.recent);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };
  
    fetchActivities(); // Fetch immediately
  
    intervalId = setInterval(fetchActivities, refreshInterval); // ⏱️ use state value
  
    return () => clearInterval(intervalId); // Cleanup
  }, [refreshInterval]); // 🔁 re-run effect if interval changes
  
  

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const stats = [
    {
      title: 'Total Assets',
      value: statsData.total.toString(),
      icon: 'laptop-outline',
      color: '#6366F1',
      onPress: () => router.push('/assets'),
    },
    {
      title: 'Available',
      value: statsData.available.toString(),
      icon: 'checkmark-circle-outline',
      color: '#10B981',
      onPress: () => router.push('/assets?filter=available'),
    },
    {
      title: 'Assigned',
      value: statsData.assigned.toString(),
      icon: 'person-outline',
      color: '#F59E0B',
      onPress: () => router.push('/assets?filter=assigned'),
    },
    {
      title: 'Maintenance',
      value: statsData.maintenance.toString(),
      icon: 'construct-outline',
      color: '#EF4444',
      onPress: () => router.push('/assets?filter=maintenance'),
    },
  ];

  const quickActions = [
    {
      title: 'Add Asset',
      icon: 'add-circle-outline',
      color: '#6366F1',
      onPress: () => router.push('/assets'),
    },
    {
      title: 'Scan QR',
      icon: 'qr-code-outline',
      color: '#10B981',
      onPress: () => router.push('/scan'),
    },
    {
      title: 'Reports',
      icon: 'document-text-outline',
      color: '#F59E0B',
      onPress: () => router.push('/reports'),
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      color: '#EF4444',
      onPress: () => router.push('/settings'),
    },
  ];

  return (
    <SafeAreaView style={themeStyles.container}>
      <View style={themeStyles.headerOverlay}>
        <Text style={themeStyles.welcomeLine}>Welcome back 👋</Text>
        <Text style={themeStyles.dashboardTitle}>IT Asset Dashboard</Text>
      </View>

      <ScrollView style={themeStyles.content} showsVerticalScrollIndicator={false}>
        <View style={themeStyles.statsGrid}>
          {stats.map((stat, index) => (
            <Pressable
              key={index}
              onPress={stat.onPress}
              style={({ pressed }) => [themeStyles.statCard, pressed && themeStyles.statCardPressed]}
            >
              <View style={[themeStyles.statIconBg, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={themeStyles.statValue}>{stat.value}</Text>
              <Text style={themeStyles.statTitle}>{stat.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={themeStyles.section}>
          <View style={themeStyles.sectionHeader}>
            <Text style={themeStyles.sectionTitle}>Recent Activities</Text>
            <Pressable
              onPress={() => router.push('/reports')}
              style={({ pressed }) => [themeStyles.viewAllButton, pressed && { opacity: 0.7 }]}
            >
              <Text style={themeStyles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color="#6366F1" />
            </Pressable>
          </View>

          <View style={themeStyles.activityList}>
  {activities.map((activity: any, index: number) => (
    <Pressable
      key={index}
      style={({ pressed }) => [themeStyles.activityItem, pressed && { opacity: 0.7 }]}
    >
      <View style={[themeStyles.activityIcon, { backgroundColor: '#6366F120' }]}>
        <Ionicons name="time-outline" size={20} color="#6366F1" />
      </View>
      <View style={themeStyles.activityContent}>
        <Text style={themeStyles.activityTitle}>{activity.action}</Text>
        <Text style={themeStyles.activityDescription}>{activity.description}</Text>
        {activity.serialNumber && (
          <Text style={themeStyles.activitySerial}>Serial No: {activity.serialNumber}</Text>
        )}
        <Text style={themeStyles.activityTime}>
          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
        </Text>
      </View>
    </Pressable>
  ))}
</View>


        </View>

        <View style={themeStyles.quickActions}>
          <Text style={themeStyles.sectionTitle}>Quick Actions</Text>
          <View style={themeStyles.actionGrid}>
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                style={({ pressed }) => [themeStyles.actionCard, pressed && themeStyles.actionCardPressed]}
              >
                <View style={[themeStyles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={themeStyles.actionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Deep dark blue-gray
  },
  headerOverlay: {
    backgroundColor: '#1E293B',
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeLine: {
    color: '#CBD5E1', // soft gray text
    fontSize: 16,
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -50,
    marginHorizontal: -8,
  },
  activitySerial: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },  
  statCard: {
    width: '45%',
    backgroundColor: '#1E293B',
    margin: '2.5%',
    padding: 15,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.05)',
      },
    }),
  },
  statCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9', // light slate
  },
  statTitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#A5B4FC',
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.05)',
      },
    }),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  activityDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  quickActions: {
    marginTop: 24,
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
  },
  actionCard: {
    width: '45%',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.05)',
      },
    }),
  },
  actionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerOverlay: {
    backgroundColor: 'rgba(30, 27, 75, 0.65)',
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeLine: {
    color: '#E0E7FF',
    fontSize: 16,
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -50,
    marginHorizontal: -8,
  },
  activitySerial: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  
  statCard: {
    width: '45%',
    backgroundColor: 'white',
    margin: '2.5%',
    padding: 15,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  statCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  activityDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  quickActions: {
    marginTop: 24,
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
  },
  actionCard: {
    width: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  actionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
});