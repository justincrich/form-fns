import React from 'react'
import { text, withKnobs, boolean, select, object } from '@storybook/addon-knobs'

import { ComponentShowcase } from './decorators/ComponentShowcase'
import { Simple } from './controllers/Simple'
import {ArrayComponent} from './controllers/Array'

export default {
    title: 'Components',
    decorators: [ComponentShowcase, withKnobs],
}

export const SimpleForm = () => <Simple/>

export const ArrayForm = () => <ArrayComponent />