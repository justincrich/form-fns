import { addDecorator, addParameters } from '@storybook/react'
import { themeDecorator } from './config/theming'
import '@storybook/addon-console'

addDecorator(themeDecorator)
addParameters({
  viewport: {
    viewports: {
      tablet: {
        name: "Tablet",
        styles:{
          width: '768px',
          height: '1112px'
        }
      },
      mobile:{
        name: "Mobile",
        styles: {
          width: '375px',
          height: '568px'
        }
      }
    }
  }
})