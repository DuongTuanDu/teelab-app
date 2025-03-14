import Loading from '@/components/loading';
import { useAppSelector } from '@/hooks/useRedux';
import { Redirect } from 'expo-router';
import React from 'react'
import { View } from 'react-native'

const Account = () => {
  const { isAuthenticated, authLoading } = useAppSelector(state => state.auth);

  if (authLoading) return <Loading />

  if (!isAuthenticated && !authLoading) return <Redirect href="/login" />;

  return (
    <View>
      Account
    </View>
  )
}

export default Account
