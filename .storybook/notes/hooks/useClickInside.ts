import addons, {  useRef, useEffect } from '@storybook/addons';

export const useClickInside = <TNode extends HTMLElement>(callbackFn:(selectedElement:EventTarget | null, event:MouseEvent)=>any):{current:TNode|null} => {
  const ref = useRef<TNode|null>(null)

  useEffect(
    () => {
      const listener = (event:MouseEvent) => {
        if(!ref.current || !ref.current.contains(event.target as Node)) return null
        callbackFn(event.target, event)
      }
      document.addEventListener('mousedown', listener)
      return ()=>{
        document.removeEventListener('mousedown', listener)
      }
    }
  )

  return ref
}