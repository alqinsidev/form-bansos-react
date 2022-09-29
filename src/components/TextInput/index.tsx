import { Box, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, FC } from 'react'

type InputType = "text" | "number"

interface Props {
  label: string
  name: string
  type?: InputType
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void
  value: number | string
  error: boolean | undefined
  helperText: string | false | undefined
  placeholder?: string
}

const TextInput: FC<Props> = ({label, type = 'text', onChange, value, name, error, helperText, placeholder}) => {
  const configTextField = {
    type,
    name,
    value,
    onChange,
    error,
    helperText,
    fullWidth:true,
    placeholder
  }
  return (
    <Box marginBottom={2}>
      <Typography>{label}</Typography>
      <TextField {...configTextField} />
    </Box>
  )
}

export default TextInput
