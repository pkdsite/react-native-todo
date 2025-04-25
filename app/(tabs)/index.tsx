import { Image, StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ToDoType = {
  id: number,
  title: string,
  isDone: boolean
}

export default function HomeScreen() {
  const todoData = [
    {
      id: 1,
      title: 'Todo 1x',
      isDone: false
    },
    {
      id: 2,
      title: 'Todo 2',
      isDone: false
    },
    {
      id: 3,
      title: 'Todo 3',
      isDone: true
    },
    {
      id: 4,
      title: 'Todo 4',
      isDone: false
    },
    {
      id: 5,
      title: 'Todo 5',
      isDone: false
    }
  ];

  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oldTodos, setOldTodos] = useState<ToDoType[]>([]);

  useEffect(() => {
    const getTodos = async() => {
      try {
        const todos = await  AsyncStorage.getItem('my-todo');
        if (todos) {
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));
        }
      } catch(err) {
        console.log(err);
      }
    };
    getTodos();
  }, []);

  const onSearch = (query: string) => {
    if (query === '') {
      setTodos(oldTodos);
    } else {
      const filteredTodo = todos.filter((todo) => 
      todo.title.toLowerCase().includes(query.toLowerCase())
    );
    setTodos(filteredTodo);
    }
  }

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery]);

  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false
      };
      todos.push(newTodo);
      setTodos(todos);
      setOldTodos(todos);

      await AsyncStorage.setItem('my-todo', JSON.stringify(todos));
      setTodoText('');
    } catch (err) {
      console.log(err);
    }
  }

  const deleteTodo = async(id: number) => {
    try {
      const newTodos = todos.filter((todo) =>
        todo.id != id
      );
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch(err) {
      console.log(err);
    }
  }

  const handleDone = async(id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {alert('CLICKED!')}}>
          <Ionicons name='menu' size={24} color={'#333'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {alert('CLICKED!')}}>
          <Image source={{uri: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk'}} style={{width: 40, height: 40, borderRadius: 20}} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name='search' size={24} color={'#333'} />
        <TextInput placeholder='Search' value={searchQuery} onChangeText={(text) => setSearchQuery(text)} style={styles.searchInput} clearButtonMode="always" />
      </View>
        <FlatList data={[...todos].reverse()} keyExtractor={(item)=> item.id.toString()} renderItem={({item})=>(
            <TodoItem todo={item} deleteTodo={deleteTodo} handleDone={handleDone}/>
          )}
        />
      
      <KeyboardAvoidingView style={styles.footer} behavior='padding'>
        <TextInput placeholder='Add New Todo' autoCorrect={false} value={todoText} onChangeText={(text) => {setTodoText(text)}} style={styles.newTodoInput} />
        <TouchableOpacity style={styles.addButton} onPress={() => {addTodo()}}>
          <Ionicons name='add' size={34} color={'#fff'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const TodoItem = ({handleDone, todo, deleteTodo} : {handleDone: (id: number) => void; todo: ToDoType; deleteTodo: (id: number) => void}) => (
  <View style={styles.todoContainer}>
              <View style={styles.todoInfoContainer}>
                <Checkbox value={todo.isDone} onValueChange={() => handleDone(todo.id)} color={todo.isDone ? '#4630EB' : undefined} />
                <Text style={[styles.todoText, todo.isDone && { textDecorationLine: 'line-through' }]}>{todo.title}</Text>
              </View>
              <TouchableOpacity onPress={() => {alert('Deleted ' +todo.title); deleteTodo(todo.id)}}>
                <Ionicons name='trash' size={24} color={'red'} />
              </TouchableOpacity>
            </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: '#f5f5f5',
    marginLeft: 20,
    marginRight: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    gap: 10,
    marginBottom: 25
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  todoInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  todoText: {
    fontSize: 16,
    color: '#333'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 80,
    gap: 10
  },
  newTodoInput: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 16
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 4,
    borderRadius: 10
  }
});
