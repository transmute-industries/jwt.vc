import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { styled, alpha } from '@mui/material/styles'

import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { debounce } from '@mui/material'

const SearchTextField = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

export default function ComboBox({onQuery, selected, onSelected, options}) {
  return (
    <Autocomplete
      disablePortal
      value={selected}
      options={options}
      sx={{ m: 1 }}
      getOptionLabel={(option) => option.text}
      isOptionEqualToValue={(option, value)=>{
        if (!value){
          return true
        }
        return option.label === value.label
      }}
      size="small"
      onChange={(_event, selection)=>{
        onSelected(selection)
      }}
      renderInput={(params) => {
        return (
          <SearchTextField
            {...params}
            variant="outlined"
            onChange={debounce((event)=>{
              onQuery(event.target.value)
            }, 1000)}
            sx={{
              minWidth: '172px',
              '& fieldset': {
                border: 'none',
              },
            }}
            placeholder="Search..."
            InputProps={{
              ...params.InputProps,
              type: 'search',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )
      }}
    />
  )
}
