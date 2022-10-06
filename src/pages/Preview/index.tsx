import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { clearData } from '../../redux/slice/formSlice'

const Preview = () => {
  const { form } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleGoBack = () => {
    dispatch(clearData())
    navigate('/')
  }
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        component={Paper}
        p={5}
        mt={{ xs: 0, md: 2 }}
        mb={.2}
        width={{ xs: '90%', md: '60%' }}
        bgcolor='#066d3a'
      >
        <Typography variant='h5' color={'white'}>
          Aplikasi pengajuan dana bantuan masyarakat terkena dampak Covid-19
        </Typography>
      </Box>
      <Box
        component={Paper}
        p={5}
        mt={{ xs: 0, md: 2 }}
        mb={2}
        width={{ xs: '90%', md: '60%' }}
        bgcolor='white'
      >
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Lengkap</TableCell>
                <TableCell>{form.nama}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>NIK</TableCell>
                <TableCell>{form.nik}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>No KK</TableCell>
                <TableCell>{form.noKK}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Jenis Kelamin</TableCell>
                <TableCell>{form.jenisKelamin}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Umur</TableCell>
                <TableCell>{form.umur}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Provinsi</TableCell>
                <TableCell>{form.provinsi}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Kabupaten / Kota</TableCell>
                <TableCell>{form.wilayah}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Kecamatan</TableCell>
                <TableCell>{form.kecamatan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Kelurahan / Desa</TableCell>
                <TableCell>{form.desa}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Alamat Lengkap</TableCell>
                <TableCell>{form.alamat}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Penghasilan Sebelum Covid</TableCell>
                <TableCell>{form.penghasilanSebelum}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Penghasilan Setelah Covid</TableCell>
                <TableCell>{form.penghasilanSetelah}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Alasan Pengajuan</TableCell>
                <TableCell>{form.alasanPengajuan}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Button sx={{marginY:10}} color={'error'} onClick={handleGoBack}>Kembali ke form pengajuan</Button>
    </Container>
  )
}

export default Preview
