import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',        //black
    primary: '#2BDA8E',     //green
    secondary: '#414757',   //dark blue
    error: '#f13a59',       //red
    gray: '#C5CCD6',        //grey
    success: '#00B386',     //green
  },
}