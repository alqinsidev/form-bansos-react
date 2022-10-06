import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface FormPayload {
    nama: string
    nik: number
    noKK: number
    fileKTP: string
    fileKK: string
    umur: number
    jenisKelamin: string
    provinsi: string
    wilayah: string
    kecamatan: string
    desa: string
    alamat: string
    penghasilanSebelum: number
    penghasilanSetelah: number
    alasanPengajuan: string
  }



const initialState: FormPayload = {
    nama: "",
    nik: 0,
    noKK: 0,
    fileKTP: "",
    fileKK: "",
    umur: 0,
    jenisKelamin: "",
    provinsi: "",
    wilayah: "",
    kecamatan: "",
    desa: "",
    alamat: "",
    penghasilanSebelum: 0,
    penghasilanSetelah: 0,
    alasanPengajuan: "",
};

export const formSlice = createSlice({
  name: "FormSlice",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<FormPayload>) => {
        state.nama = action.payload.nama
        state.nik = action.payload.nik
        state.noKK = action.payload.noKK
        state.fileKTP = action.payload.fileKTP
        state.fileKK = action.payload.fileKK
        state.umur = action.payload.umur
        state.jenisKelamin = action.payload.jenisKelamin
        state.provinsi = action.payload.provinsi
        state.wilayah = action.payload.wilayah
        state.kecamatan = action.payload.kecamatan
        state.desa = action.payload.desa
        state.alamat = action.payload.alamat
        state.penghasilanSebelum = action.payload.penghasilanSebelum
        state.penghasilanSetelah = action.payload.penghasilanSetelah
        state.alasanPengajuan = action.payload.alasanPengajuan
    },
    clearData: () => initialState
  },
});


export const { setData, clearData } = formSlice.actions;
export const getFormData = (state: RootState) => state.form;
export default formSlice.reducer;