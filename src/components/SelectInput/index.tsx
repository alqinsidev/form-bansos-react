import {
  Box,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, FC } from 'react'

interface Option {
  key: string
  value: string | number
  label: string
}

interface Props {
  label: string
  name: string
  options: Option[]
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  value: number | string
  error: boolean | undefined
  helperText: string | false | undefined
}
const SelectInput: FC<Props> = ({ label, name, options, onChange, value, error, helperText }) => {
  const configSelect = {
    name,
    value,
    onChange,
    error,
    helperText,
    select:true,
    defaultValue:'',
    fullWidth: true
  }
  return (
    <Box marginBottom={2}>
      <Typography>{label}</Typography>
      <TextField {...configSelect}>
        <MenuItem value={'0'} disabled>
          <em>Pilih {label}</em>
        </MenuItem>
        {options.map((item: Option) => {
          return (
            <MenuItem key={item.key} value={item.value}>
              {item.label}
            </MenuItem>
          )
        })}
      </TextField>
    </Box>
  )
}

export default SelectInput
