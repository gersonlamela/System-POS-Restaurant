import React, { useState } from 'react'
import KeyboardWrapper from './KeyboardWrapper'
import { Notepad } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

interface NotePopupProps {
  currentNote: string // Adiciona a propriedade currentNote
  onConfirm: (note: string) => void
}

export const NotePopup: React.FC<NotePopupProps> = ({
  currentNote,
  onConfirm,
}) => {
  const [note, setNote] = useState(currentNote)
  const [isOpen, setIsOpen] = useState(false)

  const closeDialog = () => {
    setIsOpen(false)
  }

  // Função para atualizar o valor do input
  const updateNoteValue = (value: string) => {
    setNote(value)
  }

  // Função para confirmar a nota e fechar o diálogo
  const confirmNote = (note: string) => {
    onConfirm(note)
    closeDialog()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <Button variant="ghost">
          <Notepad size={20} /> Add Nota
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-[15px] rounded-md bg-white p-4 shadow-md">
        <KeyboardWrapper
          note={note}
          onChange={updateNoteValue}
          onConfirm={confirmNote}
        />
      </DialogContent>
    </Dialog>
  )
}
