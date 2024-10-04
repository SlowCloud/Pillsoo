import React, {useRef, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
}

const SearchBar = ({
  placeholder,
  value,
  onChangeText,
  onSearch,
}: SearchBarProps) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleKeyPress}
        />
        <TouchableOpacity onPress={onSearch} style={styles.button}>
          <Icon name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    flex: 1,
    paddingHorizontal: 8,
    color: 'black',
  },
  button: {
    padding: 8,
  },
});

export default SearchBar;
