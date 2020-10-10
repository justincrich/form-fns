import React from 'react'
import { text, withKnobs, boolean, select, object } from '@storybook/addon-knobs'
import withNotes from '../../.storybook/notes/decorator'
import { Navbar } from '../components/Navbar'
import { Input } from '../components/Input'
import { DisplayInput } from '../components/Input/display'
import { ComponentShowcase } from './decorators/ComponentShowcase'

export default {
    title: 'Components',
    decorators: [ComponentShowcase, withKnobs, withNotes],
}

export const navbar = () => <Navbar />

export const textInput = () => <Input error={text('Error Message', '')} disabled={boolean('Disabled', false)} label={text('Label','First Name')} value={text('Value','')} onChange={(value)=>{
}}/>

export const displayInput = () => <DisplayInput error={text('Error Message', '')} disabled={boolean('Disabled', false)} label={text('Label','First Name')} value={text('Value','')} onChange={(value)=>{
}}/>
