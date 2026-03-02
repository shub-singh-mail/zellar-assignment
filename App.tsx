import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Config from 'react-native-config';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { RootNav } from './src/navigation';

const client = new ApolloClient({
  link: new HttpLink({
    uri: Config.BASE_URL,
    useGETForQueries: true,
    headers: {
      'x-api-key': Config.KEY,
    },
  }),
  cache: new InMemoryCache(),
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ApolloProvider client={client}>
        <RootNav />
      </ApolloProvider>
    </SafeAreaProvider>
  );
}

export default App;
