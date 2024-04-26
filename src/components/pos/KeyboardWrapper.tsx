import React, { FunctionComponent, useRef, useEffect, useState } from 'react'
import Keyboard, { KeyboardReactInterface } from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

interface IProps {
  onChange: (input: string) => void
  note: string
  onConfirm: (note: string) => void // Função de confirmação adicionada
}

const KeyboardWrapper: FunctionComponent<IProps> = ({
  onChange,
  note,
  onConfirm,
}) => {
  const keyboard = useRef<KeyboardReactInterface | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Criando uma ref para o textarea
  const [layout, setLayout] = useState('default')

  useEffect(() => {
    if (keyboard.current && textareaRef.current) {
      keyboard.current.setInput(note)
      textareaRef.current.value = note
    }
  }, [note])

  const handleShift = () => {
    const newLayoutName = layout === 'default' ? 'shift' : 'default'
    setLayout(newLayoutName)
  }

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') handleShift()
    if (button === '{enter}') {
      onConfirm(note)
    }
  }

  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        placeholder="Digite a nota aqui..."
        className="mb-2 h-32 w-full rounded-md border border-gray-300 p-2"
        onChange={(e) => onChange(e.target.value)}
      />

      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        inputName="note"
        layoutName={layout}
        onChange={(input) => {
          onChange(input)
          if (textareaRef.current) {
            textareaRef.current.value = input
          }
        }}
        onKeyPress={onKeyPress}
        display={{
          '{shift}': '⇧',
          '{space}': ' ',
          '.com': '.com',
          '@': '@',
          '{lock}': '⇪',
          '{tab}': '↹',
          '{bksp}': '⌫',
          '{enter}': '⏎',
        }}
      />
    </div>
  )
}

export default KeyboardWrapper
