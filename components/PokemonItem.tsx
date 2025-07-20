import { Pokemon } from "@/utils/pokemon";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

interface PokemonItemProps {
  pokemon: Pokemon;
}

const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#A8A878';
};

export const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          contentFit="contain"
          placeholder="Pokemon"
        />
      </View>
      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: theme.colors.text }]}
        >
          {pokemon.name}
        </Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((type, index) => (
            <View
              key={index}
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(type) }
              ]}
            >
              <Text style={styles.typeText}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </View>
          ))}
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.stats,
            { color: Color(theme.colors.text).alpha(0.6).toString() },
          ]}
        >
          #{pokemon.id.toString().padStart(3, '0')} • {pokemon.height}m • {pokemon.weight}kg
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  stats: {
    fontSize: 12,
  },
}); 