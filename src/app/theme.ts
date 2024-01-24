import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const themes = responsiveFontSizes(theme)

export default themes
