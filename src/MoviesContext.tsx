import { ReactNode, useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { api } from "./services/api";

interface GenreResponseProps {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
}

interface ProviderMoviesProps{
    children: ReactNode;

}
  
interface MovieProps {
    imdbID: string;
    Title: string;
    Poster: string;
    Ratings: Array<{
        Source: string;
        Value: string;
    }>;
    Runtime: string;
}

interface MoviesContextData{
    genres: GenreResponseProps[];
    selectedGenreId: number;
    selectedGenre: GenreResponseProps;
    handleClickButton: (id: number) => void;
    movies:MovieProps[];
}

const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData)

export function MoviesProvider({children}: ProviderMoviesProps){
    const [selectedGenreId, setSelectedGenreId] = useState(1);

    const [genres, setGenres] = useState<GenreResponseProps[]>([]);

    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

    useEffect(() => {
        api.get<GenreResponseProps[]>('genres').then(response => {
            setGenres(response.data);
        });
    }, []);

    useEffect(() => {
        api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
            setMovies(response.data);
        });

        api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
            setSelectedGenre(response.data);
        })
    }, [selectedGenreId]);

    function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
      <MoviesContext.Provider value={{genres, selectedGenreId, selectedGenre, handleClickButton, movies}}>
          {children}
      </MoviesContext.Provider>
  )
}

export function UseMovies(){
    const context = useContext(MoviesContext);

    return context
}