import {
  IOS_LIKE_BOUNCE_CONFIG,
  SearchBarHeight,
} from "@/components/ListGesture";
import { useSearchContext } from "@/context/SearchContext";
import { useBackHandler } from "@/hooks/useBackHandler";
import { PokemonApiService, Pokemon } from "@/utils/pokemon";
import { PokemonItem } from "@/components/PokemonItem";
import { PokemonSkeleton } from "@/components/PokemonSkeleton";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View, FlatList, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SearchScreen = () => {
  const { searchOffsetY, isSearchOpen, setIsSearchOpen } = useSearchContext();
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useBackHandler(() => {
    if (isSearchOpen) {
      runOnJS(setIsSearchOpen)(false);
    }
    return true;
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      searchOffsetY.value = withSpring(top, IOS_LIKE_BOUNCE_CONFIG);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      // Reset search when closing
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen, searchOffsetY, top]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    if (query.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    try {
      const results = await PokemonApiService.searchPokemon(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const animatedBackButtonStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(searchOffsetY.get(), [top, 200], [44, 0]),
    };
  });

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: searchOffsetY.get() }],
    };
  });

  if (!isSearchOpen) return null;
  return (
    <Animated.View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Animated.View
        style={[styles.searchBarContainer, animatedSearchBarStyle]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Animated.View
            style={[styles.searchBarIcon, animatedBackButtonStyle]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.searchBarIconBack,
                pressed && {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setIsSearchOpen(false)}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </Pressable>
          </Animated.View>
          <View style={styles.searchBarInput}>
            <TextInput
              ref={searchInputRef}
              placeholder="Search Pokémon..."
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={"rgba(111, 111, 111, 0.5)"}
              cursorColor={theme.colors.text}
              selectionHandleColor={theme.colors.text}
              selectionColor={
                Platform.OS === "android"
                  ? Color(theme.colors.text).alpha(0.3).toString()
                  : theme.colors.text
              }
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>
      </Animated.View>
      <View
        style={{
          flex: 1,
          marginTop: SearchBarHeight,
        }}
      >
        {isSearching ? (
          <PokemonSkeleton count={5} />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={({ item }) => <PokemonItem pokemon={item} />}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.searchResultsContainer}
          />
        ) : searchQuery.length > 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.colors.text }]}>
              No Pokémon found
            </Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    height: SearchBarHeight,
    width: "100%",
    justifyContent: "center",
    zIndex: 1000,
  },
  searchBar: {
    marginHorizontal: 10,
    borderRadius: 99,
    height: 44,
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchBarIcon: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  searchBarIconBack: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  searchBarInput: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 17,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(111, 111, 111, 0.2)",
    width: "85%",
    alignSelf: "flex-end",
  },
  searchResultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
  },
});
