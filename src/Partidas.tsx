import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material'
import type { components } from './schema'
import SetGroup from './SetGroup';

type PartidaType = components["schemas"]["Partida"];

const ludopediaUrl: string = import.meta.env.VITE_LUDOPEDIA_URL;

const Partidas: React.FC<{ usuario: string, token: string }> = ({ usuario, token }) => {
  const [partidas, setPartidas] = useState<PartidaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialDate, setInitialDate] = useState<Date | null>(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
  const [page, setPage] = useState<number>(1);
  const rows = 20;
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchPartidas();
  }, [initialDate, page]);

  useEffect(() => {
    fetchInfoPartidas(partidas);
  }, [loading]);

  const fetchInfoPartidas = async (partidas: PartidaType[]) => {
    if (!loading) return;
    const newPartidas = [...partidas];
    for (var i = 0; i < newPartidas.length; i++) {
      const partida = newPartidas[i];
      const response = await axios.get(`${ludopediaUrl}/api/v1/partidas/${partida.id_partida}`, {
        headers: {
          Authorization: token,
        },
      })
      newPartidas[i] = response.data;
    }
    setPartidas(newPartidas);
    setLoading(false);
  }

  const fetchPartidas = async () => {
    try {
      const formattedDate = initialDate ? formatDate(initialDate) : '';
      const url = `${ludopediaUrl}/api/v1/partidas?dt_ini=${formattedDate}&page=${page}&rows=${rows}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      const { total, partidas } = response.data;
      setPartidas(partidas);
      setTotal(total);
      setLoading(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setInitialDate(date);
    setPage(1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleItemUpdated = (partida: PartidaType, index: number) => {
    const newPartidas = [...partidas];
    newPartidas[index] = partida;
    setPartidas(newPartidas);
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekday = (dateString: string): string => {
    const date = new Date(dateString);
    const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const weekdayIndex = date.getDay();
    return weekdays[weekdayIndex];
  };

  return (
    <div>
      <h2>Partidas</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DatePicker
          selected={initialDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={15}
          className="date-picker"
          popperPlacement="bottom-start"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <Button onClick={handleFirstPage} disabled={page === 1}>
            First
          </Button>
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          <span style={{ fontSize: '12px', color: 'red' }}>Page: {page} / {Math.ceil(total / rows)}</span>
          <Button onClick={handleNextPage} disabled={page * rows >= total}>
            Next
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ background: 'linear-gradient(to bottom, #e6f7ff, #b3e6ff)' }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Thumb</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Jogo</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Jogadores</TableCell>
              <TableCell>Grupo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partidas.map((partida, index) => (
              <TableRow key={index}>
                <TableCell>{(page - 1) * rows + index + 1}</TableCell>
                <TableCell style={{ maxWidth: '50px' }}>
                  <img src={partida.jogo.thumb} alt="Thumbnail" width="50px" />
                </TableCell>
                <TableCell>{partida.id_partida}</TableCell>
                <TableCell>{partida.dt_partida} ({getWeekday(partida.dt_partida)})</TableCell>
                <TableCell>{partida.jogo.nm_jogo}</TableCell>
                <TableCell>{partida.duracao}</TableCell>
                <TableCell style={{ maxWidth: '300px' }}>{partida.jogadores.map(j => j.nome).join(', ')}</TableCell>
                <TableCell>
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SetGroup usuario={usuario} token={token} partida={partida} index={index} handleItemUpdated={handleItemUpdated}/>
                  )}
                </TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <Button onClick={handleFirstPage} disabled={page === 1}>
            First
          </Button>
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          <span style={{ fontSize: '12px', color: 'red' }}>Page: {page} / {Math.ceil(total / rows)}</span>
          <Button onClick={handleNextPage} disabled={page * rows >= total}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Partidas;