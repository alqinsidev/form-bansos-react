import { Box, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, FC } from 'react'


interface Props {
  label: string
  name: string
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void
  value: number | string
  error: boolean | undefined
  helperText: string | false | undefined
  placeholder?: string
}

const TextArea: FC<Props> = ({label, onChange, value, name, error, helperText, placeholder}) => {
  const configTextField = {
    name,
    value,
    onChange,
    error,
    helperText,
    fullWidth:true,
    placeholder,
    multiline:true,
    minRows:2
  }
  return (
    <Box marginBottom={2}>
      <Typography>{label}</Typography>
      <TextField {...configTextField} />
    </Box>
  )
}

export default TextArea
