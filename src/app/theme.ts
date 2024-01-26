import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})

const themes = responsiveFontSizes(theme)

export default themes
