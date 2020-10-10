import React from 'react'
import "./decorator.css"
import { WRAPPER_ID, CLASS_NAMES, PANEL_ID } from './constants'
import { CommentPanel } from './panel/CommentPanel'
import addons, { makeDecorator, useEffect, useState } from '@storybook/addons';
import { useClickInside } from './hooks/useClickInside';
import { useMemoryState } from './hooks/useMemoryState';



const removeClass = (domNode:EventTarget|null) => {
  if(!domNode) return
  domNode.classList.remove(`${CLASS_NAMES.root}_${CLASS_NAMES.selected}`)
}
const addClass = (domNode:EventTarget|null) => {
  if(!domNode) return
  const inPanel = domNode.closest(`#${PANEL_ID}`)
  console.log(inPanel)
  domNode.classList.add(`${CLASS_NAMES.root}_${CLASS_NAMES.selected}`)
}
export default makeDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  wrapper: (getStory, context, { parameters }) => {
    // const channel = addons.getChannel();
    const {id, name} = context
    const [selected, onSelect] = useState<EventTarget|null>(null)
    const ref = useClickInside<HTMLDivElement>((element)=>{

      if(selected === element){
        removeClass(element)
        onSelect(null)
      }else if(selected){
        removeClass(selected)
        addClass(element)
        onSelect(element)
      }else{
        addClass(element)
        onSelect(element)
      }
      
    })

    // useEffect(()=>{
    //   console.log(currentValue, previousValue)
    //   const handleSelection = () => {
        
    //     if(currentValue){
    //       currentValue.classList.add(`${CLASS_NAMES.root}_${CLASS_NAMES.selected}`)
    //     }
    //     if(previousValue){
    //       previousValue.classList.remove(`${CLASS_NAMES.root}_${CLASS_NAMES.selected}`)
    //     }
    //   }

    //   handleSelection()
    // },[currentValue, previousValue])
    // // Our API above sets the notes parameter to a string,
    // // which we send to the channel
    // channel.emit('my/customEvent', parameters);
    // we can also add subscriptions here using channel.on('eventName', callback);

    return (
      <div id={WRAPPER_ID} ref={ref}>
        {getStory(context)}
        <CommentPanel/>
      </div>
    );
  }
})