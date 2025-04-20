// src/hooks/usePokemonAPI.js
import { useState, useEffect } from "react";

export function usePokemonAPI(ids) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all(
        ids.map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
            res.json()
          )
        )
      );
      setData(results);
    }
    fetchData();
  }, [ids]);

  return data;
}
