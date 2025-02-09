import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Form from './components/Form';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulário de Cadastro</Text>
      <Form />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
