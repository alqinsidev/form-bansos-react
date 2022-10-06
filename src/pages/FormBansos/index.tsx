import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
  Alert,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@mui/material'
import { useFormik } from 'formik'
import { number, object, string } from 'yup'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import { SelectInput, TextArea, TextInput } from '../../components'
import { FormServices, LocationServices } from '../../services'
import { useAppDispatch } from '../../redux/hook'
import { FormPayload, setData } from '../../redux/slice/formSlice'
import { ResponseResult } from '../../services/FormService'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  nama: '',
  nik: '',
  noKK:'',
  umur: '',
  jenisKelamin: 0,
  provinsi: 0,
  wilayah: 0,
  kecamatan: 0,
  desa: 0,
  alamat: '',
  rt: '',
  rw: '',
  penghasilanSetelah: '',
  penghasilanSebelum: '',
  alasanPengajuan: 0,
  alasanLainya: '',
  fileKTP: '',
  fileKK: '',
}

const validationSchema = object({
  nama: string().required('Nama harus diisi'),
  nik: number().required('NIK harus diisi').min(10000000000, 'NIK Tidak valid'),
  noKK: number().required('NO KK harus diisi').min(10000000000, 'NO KK Tidak valid'),
  umur: number().moreThan(24, 'Umur minimal 25 tahun').required('Masukan umur anda'),
  jenisKelamin: number()
    .moreThan(0, 'Masukan jenis kelamin anda')
    .required('Masukan jenis kelamin anda'),
  provinsi: number().moreThan(0, 'Provinsi harus diisi').required(),
  wilayah: number().moreThan(0, 'Kota / Kabupaten harus diisi').required(),
  kecamatan: number().moreThan(0, 'Kecamatan harus diisi').required(),
  desa: number().moreThan(0, 'Desa / Kelurahan harus diisi').required(),
  alamat: string().required('Detail alamat harus diisi').max(255, 'Detail alamat terlalu panjang'),
  rt: number().moreThan(0, 'Pastikan RT anda benar').required('Masukan RT anda'),
  rw: number().moreThan(0, 'Pastikan RW anda benar').required('Masukan RW anda'),
  penghasilanSebelum: number()
    .moreThan(0, 'Pastikan data anda benar')
    .required('Masukan penghasilan anda'),
  penghasilanSetelah: number()
    .moreThan(0, 'Pastikan data anda benar')
    .required('Masukan penghasilan anda'),
  alasanPengajuan: number().moreThan(0, 'alasan tidak valid').required(),
  fileKTP: string().required('Upload Foto KTP'),
  fileKK: string().required('Upload Foto KK'),
})

interface Options {
  key: string
  value: string | number
  label: string
}

const JENIS_KELAMIN: Options[] = [
  { key: 'JK-L', value: 1, label: 'LAKI - LAKI' },
  { key: 'JK-P', value: 2, label: 'PEREMPUAN' },
]

const ALASAN_PENGAJUAN: Options[] = [
  { key: 'AP-1', value: 1, label: 'Kehilangan pekerjaan' },
  { key: 'AP-2', value: 2, label: 'Kepala keluarga terdampak atau korban Covid-19' },
  { key: 'AP-3', value: 3, label: 'Tergolong fakir/miskin semenjak sebelum Covid-19' },
  { key: 'AP-0', value: 99, label: 'Lainnya' },
]
function FormBansos() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const formKTPRef = useRef<HTMLInputElement>(null)
  const formKKRef = useRef<HTMLInputElement>(null)
  const [provinces, setProvinces] = useState<Options[]>([])
  const [regencies, setRegencies] = useState<Options[]>([])
  const [districts, setDistricts] = useState<Options[]>([])
  const [villages, setVillages] = useState<Options[]>([])
  const [fileKTP, setFileKTP] = useState<FileList | null>(null)
  const [isFileKTPOverSized, setIsFileKTPOverSized] = useState<boolean>(false)
  const [fileKK, setFileKK] = useState<FileList | null>(null)
  const [isFileKKOverSized, setIsFileKKOverSized] = useState<boolean>(false)
  const [isTnCAgree, setIsTnCAgree] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertOpen, setAlertOpen] = useState<boolean>(false)
  const [resultMessage, setResultMessage] = useState<ResponseResult | any>({
    success: false,
    message: 'Error',
  })

  useEffect(() => {
    getData()
  }, [])

  const getData = async (category = 'province', id = '0') => {
    try {
      let res
      let callBack
      switch (category) {
        case 'province':
          res = await LocationServices.getProvince()
          callBack = setProvinces
          break
        case 'regencies':
          res = await LocationServices.getRegencies(id)
          callBack = setRegencies
          break
        case 'districts':
          res = await LocationServices.getDistricts(id)
          callBack = setDistricts
          break
        case 'villages':
          res = await LocationServices.getVilages(id)
          callBack = setVillages
          break
      }
      const rawData = res?.data
      const formattedData: Options[] = rawData.map((item: { id: string; name: string }) => ({
        key: `${item.id}-${item.name}`,
        value: item.id,
        label: item.name,
      }))
      callBack?.(formattedData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const provinceString = provinces.find(
        (item) => Number(item.value) === Number(values.provinsi),
      )?.label
      const regencyString = regencies.find(
        (item) => Number(item.value) === Number(values.wilayah),
      )?.label
      const districtString = districts.find(
        (item) => Number(item.value) === Number(values.kecamatan),
      )?.label
      const villageString = villages.find(
        (item) => Number(item.value) === Number(values.desa),
      )?.label
      const genderString = JENIS_KELAMIN.find(
        (item) => Number(item.value) === Number(values.jenisKelamin),
      )?.label
      const alasanString =
        Number(values.alasanPengajuan) !== 99
          ? ALASAN_PENGAJUAN.find((item) => Number(item.value) === Number(values.alasanPengajuan))
              ?.label
          : values.alasanLainya

      const formattedValues: FormPayload = {
        ...values,
        provinsi: provinceString,
        wilayah: regencyString,
        kecamatan: districtString,
        desa: villageString,
        jenisKelamin: genderString,
        alasanPengajuan: alasanString,
      }
      const res = await FormServices.postData(formattedValues)
      setResultMessage(res)
      if(res.success){
        dispatch(setData(formattedValues))
      }

    } catch (error) {
      setResultMessage(error)
      console.error(error)
    } finally {
      setAlertOpen(true)
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

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
        mb={2}
        width={{ xs: '90%', md: '60%' }}
        bgcolor='#066d3a'
      >
        <Typography variant='h5' color='white'>
          Form pendaftaran bantuan sosial masyarakat terdampak COVID-19
        </Typography>
      </Box>
      <Stack p={5} mb={5} width={{ xs: '90%', md: '60%' }} component={Paper}>
        <Box mb={3}>
          <Alert severity='info'>
            Harap mengisi data dengan jujur dan benar. Segala macam bentuk kesalahan pengisian data
            adalah sepenuhnya menjadi tanggung jawab pemohon
          </Alert>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Box mb={2}>
            <Typography variant='h6'>DATA PRIBADI</Typography>
          </Box>
          <TextInput
            name='nama'
            label='Nama Lengkap'
            placeholder='Masukan nama lengkap sesuai KTP di sini'
            onChange={formik.handleChange}
            value={formik.values.nama}
            error={formik.touched.nama && Boolean(formik.errors.nama)}
            helperText={formik.touched.nama && formik.errors.nama}
          />
          <TextInput
            name='nik'
            label='Nomor Induk Kependudukan'
            placeholder='Masukan NIK anda di sini'
            onChange={formik.handleChange}
            value={formik.values.nik}
            error={formik.touched.nik && Boolean(formik.errors.nik)}
            helperText={formik.touched.nik && formik.errors.nik}
          />
          <TextInput
            name='noKK'
            label='Nomor Kartu Keluarga'
            placeholder='Masukan No KK anda di sini'
            onChange={formik.handleChange}
            value={formik.values.noKK}
            error={formik.touched.noKK && Boolean(formik.errors.noKK)}
            helperText={formik.touched.noKK && formik.errors.noKK}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ md: 2, xs: 0 }}>
            <Box flex={1}>
              <TextInput
                name='umur'
                label='Umur'
                type='number'
                placeholder='Masukan umur anda di sini'
                onChange={formik.handleChange}
                value={formik.values.umur}
                error={formik.touched.umur && Boolean(formik.errors.umur)}
                helperText={formik.touched.umur && formik.errors.umur}
              />
            </Box>
            <Box flex={1}>
              <SelectInput
                name='jenisKelamin'
                label='Jenis Kelamin'
                options={JENIS_KELAMIN}
                onChange={formik.handleChange}
                value={formik.values.jenisKelamin}
                error={formik.touched.jenisKelamin && Boolean(formik.errors.jenisKelamin)}
                helperText={formik.touched.jenisKelamin && formik.errors.jenisKelamin}
              />
            </Box>
          </Stack>
          <Box>
            <Typography>Foto KTP</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingY: 5,
                marginBottom: 3,
                borderRadius: 1,
                border: 1,
                borderWidth: 2,
                borderColor:
                  formik.touched.fileKTP && Boolean(formik.errors.fileKTP) ? '#d32f2f' : '#38a9f4',
              }}
            >
              {!fileKTP ? (
                <Stack direction={'column'}>
                  <Button
                    aria-label={'add'}
                    component='span'
                    onClick={() => formKTPRef.current?.click()}
                  >
                    Upload
                  </Button>
                  {isFileKTPOverSized && (
                    <Typography variant='caption' color='red'>
                      File KTP tidak boleh melebihi 2MB
                    </Typography>
                  )}
                  {formik.touched.fileKTP && Boolean(formik.errors.fileKTP) && (
                    <Typography variant='caption' color='red'>
                      {formik.errors.fileKTP}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                  <Button
                    color='error'
                    onClick={() => {
                      setFileKTP(null)
                      if (formKTPRef.current) {
                        formKTPRef.current.value = ''
                      }
                    }}
                  >
                    X
                  </Button>
                  <Typography>{fileKTP?.[0].name || 'file'}</Typography>
                </Stack>
              )}
              <input
                ref={formKTPRef}
                type='file'
                style={{ display: 'none' }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const files = e.target?.files
                  const fileSize = files?.[0].size || 0
                  if (fileSize > 2000000) {
                    setIsFileKTPOverSized(true)
                  } else {
                    formik.setFieldValue('fileKTP', files?.[0]?.name)
                    setIsFileKTPOverSized(false)
                    setFileKTP(files)
                  }
                }}
                accept='.jpg, .jpeg, .png, .bmp'
              />
              <input name='fileKTP' type='hidden' value={formik.values.fileKTP} />
            </Box>
          </Box>
          <Box>
            <Typography>Foto KK</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
                paddingY: 5,
                border: 1,
                borderWidth: 2,
                borderColor:
                  formik.touched.fileKK && Boolean(formik.errors.fileKK) ? '#d32f2f' : '#38a9f4',
              }}
            >
              {!fileKK ? (
                <Stack direction={'column'}>
                  <Button
                    aria-label={'add'}
                    component='span'
                    onClick={() => formKKRef.current?.click()}
                  >
                    Upload
                  </Button>
                  {isFileKKOverSized && (
                    <Typography variant='caption' color='red'>
                      File KK tidak boleh melebihi 2MB
                    </Typography>
                  )}
                  {formik.touched.fileKK && Boolean(formik.errors.fileKK) && (
                    <Typography variant='caption' color='red'>
                      {formik.errors.fileKK}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                  <Button
                    color='error'
                    onClick={() => {
                      setFileKK(null)
                      if (formKKRef.current) {
                        formKKRef.current.value = ''
                        formik.setFieldValue('fileKK', '')
                      }
                    }}
                  >
                    X
                  </Button>
                  <Typography>{fileKK?.[0].name || 'file'}</Typography>
                </Stack>
              )}
              <input
                ref={formKKRef}
                type='file'
                style={{ display: 'none' }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const files = e.target?.files
                  const fileSize = files?.[0].size || 0

                  if (fileSize > 2000000) {
                    setIsFileKKOverSized(true)
                  } else {
                    formik.setFieldValue('fileKK', files?.[0]?.name)
                    setIsFileKKOverSized(false)
                    setFileKK(files)
                  }
                }}
                accept='.jpg, .jpeg, .png, .bmp'
              />
              <input name='fileKK' type='hidden' value={formik.values.fileKK} />
            </Box>
          </Box>
          <Box mb={2} mt={5}>
            <Typography variant='h6'>DOMISILI</Typography>
          </Box>
          <SelectInput
            name='provinsi'
            label='Provinsi'
            onChange={(e) => {
              formik.handleChange(e)
              formik.setFieldValue('wilayah', 0)
              setRegencies([])
              formik.setFieldValue('kecamatan', 0)
              setDistricts([])
              formik.setFieldValue('desa', 0)
              setVillages([])
              getData('regencies', e.target.value)
            }}
            options={provinces}
            value={formik.values.provinsi}
            error={formik.touched.provinsi && Boolean(formik.errors.provinsi)}
            helperText={formik.touched.provinsi && formik.errors.provinsi}
          />
          <SelectInput
            name='wilayah'
            label='Kota / Kabupaten'
            onChange={(e) => {
              formik.handleChange(e)
              formik.setFieldValue('kecamatan', 0)
              setDistricts([])
              formik.setFieldValue('desa', 0)
              setVillages([])
              getData('districts', e.target.value)
            }}
            options={regencies}
            value={formik.values.wilayah}
            error={formik.touched.wilayah && Boolean(formik.errors.wilayah)}
            helperText={formik.touched.wilayah && formik.errors.wilayah}
          />
          <SelectInput
            name='kecamatan'
            label='Kecamatan'
            onChange={(e) => {
              formik.handleChange(e)
              formik.setFieldValue('desa', 0)
              setVillages([])
              getData('villages', e.target.value)
            }}
            options={districts}
            value={formik.values.kecamatan}
            error={formik.touched.kecamatan && Boolean(formik.errors.kecamatan)}
            helperText={formik.touched.kecamatan && formik.errors.kecamatan}
          />
          <SelectInput
            name='desa'
            label='Desa / Kelurahan'
            onChange={(e) => {
              formik.handleChange(e)
            }}
            options={villages}
            value={formik.values.desa}
            error={formik.touched.desa && Boolean(formik.errors.desa)}
            helperText={formik.touched.desa && formik.errors.desa}
          />
          <TextArea
            name='alamat'
            label='Alamat Lengkap'
            placeholder='Masukan detail alamat anda di sini'
            onChange={formik.handleChange}
            value={formik.values.alamat}
            error={formik.touched.alamat && Boolean(formik.errors.alamat)}
            helperText={formik.touched.alamat && formik.errors.alamat}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ md: 2, xs: 0 }}>
            <Box flex={1}>
              <TextInput
                name='rt'
                label='RT'
                type='number'
                placeholder='Masukan RT anda di sini'
                onChange={formik.handleChange}
                value={formik.values.rt}
                error={formik.touched.rt && Boolean(formik.errors.rt)}
                helperText={formik.touched.rt && formik.errors.rt}
              />
            </Box>
            <Box flex={1}>
              <TextInput
                name='rw'
                label='RW'
                type='number'
                placeholder='Masukan RW anda di sini'
                onChange={formik.handleChange}
                value={formik.values.rw}
                error={formik.touched.rw && Boolean(formik.errors.rw)}
                helperText={formik.touched.rw && formik.errors.rw}
              />
            </Box>
          </Stack>
          <Box mb={2} mt={5}>
            <Typography variant='h6'>INFORMASI TAMBAHAN</Typography>
          </Box>
          <TextInput
            name='penghasilanSebelum'
            label='Penghasilan Sebelum Pandemi COVID-19'
            type='number'
            placeholder='Masukan penghasilan anda di sini'
            onChange={formik.handleChange}
            value={formik.values.penghasilanSebelum}
            error={formik.touched.penghasilanSebelum && Boolean(formik.errors.penghasilanSebelum)}
            helperText={formik.touched.penghasilanSebelum && formik.errors.penghasilanSebelum}
          />
          <TextInput
            name='penghasilanSetelah'
            label='Penghasilan Setelah Pandemi COVID-19'
            type='number'
            placeholder='Masukan penghasilan anda di sini'
            onChange={formik.handleChange}
            value={formik.values.penghasilanSetelah}
            error={formik.touched.penghasilanSetelah && Boolean(formik.errors.penghasilanSetelah)}
            helperText={formik.touched.penghasilanSetelah && formik.errors.penghasilanSetelah}
          />
          <SelectInput
            name='alasanPengajuan'
            label='Alasan Bantuan'
            onChange={(e) => {
              if (e.target.value !== '-1') {
                formik.setFieldValue('alasanLainya', '')
              }
              formik.setFieldValue('alasanPengajuan', e.target.value)
            }}
            options={ALASAN_PENGAJUAN}
            value={formik.values.alasanPengajuan}
            error={formik.touched.alasanPengajuan && Boolean(formik.errors.alasanPengajuan)}
            helperText={formik.touched.alasanPengajuan && formik.errors.alasanPengajuan}
          />
          {formik.values.alasanPengajuan === 99 && (
            <TextField
              fullWidth
              label='alasan lainya'
              onChange={(e) => {
                formik.setFieldValue('alasanLainya', e.target.value)
              }}
            />
          )}

          <input name='alasanLainya' value={formik.values.alasanPengajuan} type={'hidden'} />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setIsTnCAgree(e.target.checked)}
                  value={isTnCAgree}
                />
              }
              label='* Saya menyatakan bahwa data yang diisikan adalah benar dan siap mempertanggungjawabkan apabila ditemukan ketidaksesuaian dalam data tersebut.'
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginTop: 5,
              }}
            />
          </FormGroup>
          <Button
            type='submit'
            variant='contained'
            color={isLoading ? 'error' : 'primary'}
            fullWidth
            sx={{ marginTop: 5 }}
            disabled={!isTnCAgree || isLoading || alertOpen}
          >
            {isLoading ? 'Loading ...' : 'Kirim Pengajuan'}
          </Button>
        </form>
      </Stack>
      <Snackbar
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false)
          if (resultMessage.success) {
            navigate('/preview')
          }
        }}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ padding: 1.2, background: 'gray', borderRadius: 3 }}
      >
        <Alert severity={resultMessage.success ? 'success' : 'error'}>
          {resultMessage.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default FormBansos
