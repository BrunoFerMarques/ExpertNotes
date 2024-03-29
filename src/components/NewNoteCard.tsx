import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface NewNoteCardProps{
  onNoteCreated: (content: string) => void 
}

let speechRecognition: SpeechRecognition | null = null

const NewNoteCard = ({onNoteCreated}: NewNoteCardProps) => {
  const [shouldShowOnBoarding, setShouldShowOnBoarding]= useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleStartEditorText = () => {setShouldShowOnBoarding(false)}
  
  const handleContentChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent (event.target.value)
    if(event.target.value === ''){setShouldShowOnBoarding(true)}}
    
  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault()
    if(content ===''){
      return 
    }
    onNoteCreated(content)
    setContent('')
    setShouldShowOnBoarding(true)
    toast.success('Nota criada com sucesso')
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }
    
    setIsRecording(true)
    setShouldShowOnBoarding(false)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    speechRecognition = new SpeechRecognitionAPI()
    
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true
    
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result)=>{
        return text.concat(result[0].transcript)
      },'')
      
      setContent(transcription)
    }
    
    speechRecognition.onerror = (event) =>{
      console.error(event)
    }

    speechRecognition.start()
    
  
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    if(speechRecognition != null){
      speechRecognition.stop()
    }
  }


  return (
   
    <Dialog.Root>
      <Dialog.DialogTrigger className="rounded-md bg-slate-700 p-5 gap-3 flex flex-col text-left hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
          <span className= "text-sm font-medium text-slate-200">
            Adicionar nota
          </span>
          <p className="text-sm leading-6 text-slate-400">
              Grave uma nota de áudio que será convertida em texto
          </p>
      </Dialog.DialogTrigger>
      
      
      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="inset-0 fixed bg-black/60"/> 
          <Dialog.DialogContent className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
            <Dialog.DialogClose className='absolute right-0 bg-red-500 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className="size-5"/>
            </Dialog.DialogClose>
            <form className='flex-1 flex flex-col'>
              <div className="flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-200">
                  Adicionar nota
                </span>
              
                {shouldShowOnBoarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                  Comece <button type='button' onClick = {handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em áudio ou <button type='button' onClick={handleStartEditorText} className="font-mediun text-lime-400 hover:underline"> escreva em texto.</button>
                  </p>

                ) : (
                  <p><textarea 
                  autoFocus 
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}/></p>
                  
                )}
              </div>
              
              {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
              
              </form>
          </Dialog.DialogContent>
      </Dialog.DialogPortal>
    </Dialog.Root>
      
  );
};

export default NewNoteCard;