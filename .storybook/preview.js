import { addParameters } from '@storybook/react'
import '@storybook/addon-console'

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