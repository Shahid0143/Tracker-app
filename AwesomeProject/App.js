import React, { useEffect, useReducer } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = { opencount: 0 };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "INCREMENT":
      return { ...state, opencount: state.opencount + 1 };
    case "LOAD":
      return { ...state, opencount: payload };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadOpenCount()
  }, []);

 const loadOpenCount = async () => {
   try {
     const count = await AsyncStorage.getItem("opencount");
     if (count !== null) {
       // Handle parsing errors 
       const parsedCount = parseInt(count);
       if (!isNaN(parsedCount)) {
         dispatch({ type: "LOAD", payload: parsedCount });
       } else {
         // Use default value if parsing fails
         dispatch({ type: "LOAD", payload: initialState.opencount })
       }
     }
   } catch (err) {
     console.error(err);
   }
 };

  const incrementOpenCount = async () => {
    try {
      dispatch({ type: "INCREMENT" })
      await AsyncStorage.setItem("opencount", (state.opencount + 1).toString())  
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>App Open Counter</Text>
      <Text style={styles.count}>Opened {state.opencount} times</Text>
      <Button title="Increment Count" onPress={incrementOpenCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  count: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default App;
