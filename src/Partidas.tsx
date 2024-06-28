import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@material-ui/core';


const Partidas: React.FC<{ token: string }> = ({ token }) => {
  const [data, setData] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<Date | null>(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [page, setPage] = useState<number>(1);
  const rows = 20;
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [initialDate, page]);

  const fetchData = async () => {
    try {
      const formattedDate = initialDate ? formatDate(initialDate) : '';
      const url = `http://localhost:3000/api/v1/partidas?dt_ini=${formattedDate}&page=${page}&rows=${rows}`;
      const response = await fetch(url, {
        headers: {
          Authorization: token,
        },
      });
      const jsonData = await response.json();
      const { total, partidas } = jsonData;
      setData(partidas);
      setTotal(total);
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

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h1>Partidas</h1>
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
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          <span style={{ fontSize: '12px', color: 'red' }}>Page: {page}</span>
          <Button onClick={handleNextPage} disabled={page * rows >= total}>
            Next
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thumb</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Jogo</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Grupo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img src={item.jogo.thumb} alt="Thumbnail" />
                </TableCell>
                <TableCell>{item.id_partida}</TableCell>
                <TableCell>{item.dt_partida}</TableCell>
                <TableCell>{item.jogo.nm_jogo}</TableCell>
                <TableCell>{item.duracao}</TableCell>
                <TableCell>{item.grupo?.id_grupo_jogo} {item.grupo?.nm_grupo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Partidas;