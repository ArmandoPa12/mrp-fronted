import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Dropdown } from 'primereact/dropdown';


const Prueba = () => {
    const [character, setCharacter] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get('https://rickandmortyapi.com/api/character/232');
        setCharacter(response.data);
      } catch (error) {
        console.error('Error fetching character:', error);
      }
    };

    fetchCharacter();
  }, []);



  return (
    <div>
        


      {character ? (
        <div>
          <h2>{character.name}</h2>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Type: {character.type || 'Unknown'}</p>
          <p>Gender: {character.gender}</p>
          <p>Origin: {character.origin.name}</p>
          <p>Location: {character.location.name}</p>
          <img src={character.image} alt={character.name} />
        </div>
      ) : (
        <p>Loading...</p>
      )}

        <div className="card flex justify-content-center">
            <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" 
                placeholder="Select a City" className="w-full md:w-14rem" />
        </div>                 


    </div>
  );
};

export default Prueba;
