export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  height: number;
  weight: number;
  abilities: string[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonApiService {
  static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon list');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
      throw error;
    }
  }

  static async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetailResponse> {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon detail');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokémon detail:', error);
      throw error;
    }
  }

  static async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      // First get all Pokémon to search through them
      const response = await this.getPokemonList(1000, 0);
      const filteredResults = response.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      // Get details for filtered results (limit to first 20 for performance)
      const pokemonDetails = await Promise.all(
        filteredResults.slice(0, 20).map(async (pokemon) => {
          const detail = await this.getPokemonDetail(pokemon.name);
          return this.transformPokemonDetail(detail);
        })
      );

      return pokemonDetails;
    } catch (error) {
      console.error('Error searching Pokémon:', error);
      throw error;
    }
  }

  static transformPokemonDetail(detail: PokemonDetailResponse): Pokemon {
    return {
      id: detail.id,
      name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
      types: detail.types.map(type => type.type.name),
      imageUrl: detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default,
      height: detail.height / 10, // Convert to meters
      weight: detail.weight / 10, // Convert to kg
      abilities: detail.abilities.map(ability => ability.ability.name),
    };
  }

  static async getInitialPokemonList(): Promise<Pokemon[]> {
    try {
      const response = await this.getPokemonList(20, 0);
      const pokemonDetails = await Promise.all(
        response.results.map(async (pokemon) => {
          const detail = await this.getPokemonDetail(pokemon.name);
          return this.transformPokemonDetail(detail);
        })
      );
      return pokemonDetails;
    } catch (error) {
      console.error('Error fetching initial Pokémon list:', error);
      throw error;
    }
  }
} 