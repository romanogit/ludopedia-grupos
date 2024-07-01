import React from 'react'
import axios from 'axios'
import { Button } from '@mui/material'
import type { components } from './schema'

const ludopediaUrl: string = import.meta.env.VITE_LUDOPEDIA_URL;

const id_grupo_jogo = 1049;
const nm_grupo = 'Donos da Mesa';
const usuarios_grupo = ['Raphael Moura', 'Andrerocha88', 'BLT_Padre', 'lucas_faial', 'albomonaco', 'romanoludo'];

type PartidaType = components["schemas"]["Partida"];

type RectProps = {
  token: string;
  partida: PartidaType;
  index: number;
  handleItemUpdated: (partida: PartidaType, index: number) => void;
};
const SetGroup: React.FC<RectProps> = ({ index, partida, token, handleItemUpdated }) => {
  const calculateGroupChance = (partida: PartidaType) => {
    const total_jogadores = partida.jogadores.length;
    var count = 0;
    for (let i = 0; i < total_jogadores; i++) {
      if (usuarios_grupo.includes(partida.jogadores[i].nome)) {
        count++;
      }
    }
    return count / total_jogadores;
  };

  const handleSetGroup = (item: PartidaType) => {
    var itemWithGroup: PartidaType = Object.assign({}, item, { grupo: { id_grupo_jogo: id_grupo_jogo, nm_grupo: nm_grupo } });
    axios.post(`${ludopediaUrl}/api/v1/partidas`, itemWithGroup, {
      headers: {
        Authorization: token
      }
    })
      .then((response) => {
        handleItemUpdated(response.data, index);
      })
      .catch(error => {
        // Handle error
        console.log(error);
      });
  };

  return (
    <div>
      {
        // if item.jogadores.length is greater or equal to 3, check the calculateGroupChance
        // if it is greater than 80%, show the button
        (!partida.grupo?.id_grupo_jogo &&
          (
            (partida.jogadores.length >= 3 && calculateGroupChance(partida) >= 0.7) ||
            (partida.jogadores.length == 3 && calculateGroupChance(partida) >= 0.6)
          )
        ) && (
          <Button variant="contained" color="primary" onClick={() => handleSetGroup(partida)}>
            SET GRUPO {Math.round(calculateGroupChance(partida) * 100 * 100) / 100}%
          </Button>
        )
      }
    </div>
  );
};

export default SetGroup;