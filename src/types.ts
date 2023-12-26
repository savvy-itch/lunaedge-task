export interface Match {
  name: string,
  url: string
}

export type FormData = {
  firstName: string
  lastName: string,
  selectedPokemons: Match[]
}