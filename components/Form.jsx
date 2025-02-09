import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function Form() {
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    celular: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nomePai: '',
    nomeMae: ''
  });

  const [errors, setErrors] = useState({});
  const [isMinor, setIsMinor] = useState(false);

  // Validações

  // Função para validar e-mail
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para validar CPF
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    remainder = (remainder === 10 || remainder === 11) ? 0 : remainder;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    remainder = (remainder === 10 || remainder === 11) ? 0 : remainder;
    return remainder === parseInt(cpf.substring(10, 11));
  };

  // Função para validar CEP
  const validateCEP = (cep) => {
    cep = cep.replace(/\D/g, '');
    return cep.length === 8;
  };

  // Função para validar telefone fixo e celular
  const validatePhone = (phone, type = 'cell') => {
    let regex;
    if (type === 'landline') {
      regex = /^\(\d{2}\)\s?\d{4}-\d{4}$/;
    } else {
      regex = /^\(\d{2}\)\s?9\d{4}-\d{4}$/;
    }
    return regex.test(phone);
  };

  // Função para validar data de nascimento
  const validateDate = (date) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date)) return false;
    const [day, month, year] = date.split('/');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getFullYear() == year && dateObj.getMonth() + 1 == month && dateObj.getDate() == day;
  };

  // Função para calcular a idade
  const calculateAge = (date) => {
    const [day, month, year] = date.split('/');
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // Função para lidar com mudanças nos campos
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  
    let error = '';
    if (field === 'nome' && value.split(' ').length < 2) error = 'Nome completo é obrigatório';
    if (field === 'dataNascimento' && !validateDate(value)) error = 'Data de nascimento inválida';
    if (field === 'cpf' && !validateCPF(value)) error = 'CPF inválido';
    if (field === 'telefone' && !validatePhone(value, 'landline')) error = 'Telefone fixo inválido';
    if (field === 'celular' && !validatePhone(value, 'cell')) error = 'Celular inválido';
    if (field === 'cep' && !validateCEP(value)) error = 'CEP inválido';
    if (field === 'email' && !validateEmail(value)) error = 'Email inválido';
    if (field === 'senha') {
      if (value.length < 8) error = 'Senha deve ter no mínimo 8 caracteres';
      else if (!/[A-Z]/.test(value)) error = 'Senha deve conter pelo menos uma letra maiúscula';
      else if (!/[a-z]/.test(value)) error = 'Senha deve conter pelo menos uma letra minúscula';
      else if (!/[0-9]/.test(value)) error = 'Senha deve conter pelo menos um número';
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = 'Senha deve conter pelo menos um caractere especial';
    }
    if (field === 'confirmarSenha' && value !== form.senha) error = 'As senhas não coincidem';
    if (field === 'dataNascimento') {
      const age = calculateAge(value);
      setIsMinor(age < 18);
      if (age < 18 && (form.nomePai === '' || form.nomeMae === '')) {
        error = 'Nome do pai e da mãe são obrigatórios para menores de 18 anos';
      }
    }
  
    setErrors({ ...errors, [field]: error });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.sectionTitle}>Informações Pessoais</Text>
      {renderInput('Nome Completo', 'nome')}
      {renderInput('Data de Nascimento (DD/MM/AAAA)', 'dataNascimento')}
      {renderInput('CPF', 'cpf')}
      {renderInput('Telefone Fixo (com DDD)', 'telefone')}
      {renderInput('Celular (com DDD)', 'celular')}

      {isMinor && (
        <>
          <Text style={styles.sectionTitle}>Informações Complementares</Text>
          {renderInput('Nome do Pai', 'nomePai')}
          {renderInput('Nome da Mãe', 'nomeMae')}
        </>
      )}

      <Text style={styles.sectionTitle}>Endereço</Text>
      {renderInput('CEP', 'cep')}
      {renderInput('Endereço', 'endereco')}
      {renderInput('Número', 'numero')}
      {renderInput('Complemento (opcional)', 'complemento')}
      {renderInput('Cidade', 'cidade')}
      {renderInput('Estado', 'estado')}

      <Text style={styles.sectionTitle}>Informações da Conta</Text>
      {renderInput('Email', 'email')}
      {renderInput('Senha', 'senha', true)}
      {renderInput('Confirmar Senha', 'confirmarSenha', true)}

      <Button title="Cadastrar" onPress={() => alert('Cadastro realizado! :)')} />
    </View>
  );

  function renderInput(placeholder, field, secure = false) {
    return (
      <View>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secure}
          onChangeText={(value) => handleChange(field, value)}
          style={[styles.input, errors[field] ? styles.inputError : form[field] ? styles.inputSuccess : null]}
        />
        {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  inputSuccess: {
    borderColor: 'green',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});