'use client'

import { Input } from './input'
import { cn } from '@/shared/lib/utils'
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  useDropzone,
  type DropzoneState,
  type FileRejection,
  type DropzoneOptions,
} from 'react-dropzone'
import { toast } from 'sonner'
import { Trash2, FileIcon, CloudUpload, X, Loader2 } from 'lucide-react'

type FileUploaderContextType = {
  dropzoneState: DropzoneState
  isLOF: boolean
  isFileTooBig: boolean
  removeFileFromSet: (index: number) => Promise<void>
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
  isDeleting: number | null
  value: File[] | null
}

const FileUploaderContext = createContext<FileUploaderContextType | null>(null)

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext)
  if (!context) throw new Error('useFileUpload must be used within FileUploader')
  return context
}

type FileUploaderProps = {
  value: File[] | null
  onValueChange: (value: File[] | null) => void
  onBeforeRemove?: (file: File) => Promise<boolean> | boolean
  dropzoneOptions?: DropzoneOptions
}

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, dropzoneOptions, value, onValueChange, onBeforeRemove, children, ...props }, ref) => {
  const [isFileTooBig, setIsFileTooBig] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const {
    accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxFiles = 1,
    maxSize = 4 * 1024 * 1024,
    multiple = true,
  } = dropzoneOptions || {}

  const removeFileFromSet = useCallback(
    async (i: number) => {
      if (!value) return
      const fileToRemove = value[i]
      try {
        setIsDeleting(i)
        if (onBeforeRemove) {
          const canRemove = await onBeforeRemove(fileToRemove)
          if (!canRemove) return
        }
        const newFiles = value.filter((_, index) => index !== i)
        onValueChange(newFiles.length > 0 ? newFiles : null)
      } catch (error) {
        toast.error('Failed to remove file')
      } finally {
        setIsDeleting(null)
      }
    },
    [value, onValueChange, onBeforeRemove],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === 'file-too-large') {
            toast.error(`File too large. Max: ${maxSize / 1024 / 1024}MB`)
          } else toast.error(errors[0]?.message)
        })
        return
      }

      if (maxFiles === 1 && acceptedFiles.length > 0) {
        onValueChange([acceptedFiles[0]])
        return
      }

      const newValues = value ? [...value] : []
      acceptedFiles.forEach((file) => {
        if (newValues.length < maxFiles) {
          newValues.push(file)
        } else {
          toast.warning(`Max ${maxFiles} files allowed`)
        }
      })
      onValueChange(newValues)
    },
    [value, maxFiles, maxSize, onValueChange],
  )

  const dropzoneState = useDropzone({
    ...dropzoneOptions,
    accept,
    maxFiles,
    maxSize,
    multiple,
    onDrop,
    onDropRejected: () => setIsFileTooBig(true),
    onDropAccepted: () => setIsFileTooBig(false),
  })

  return (
    <FileUploaderContext.Provider
      value={{
        dropzoneState,
        isLOF: !!(value && value.length >= maxFiles),
        isFileTooBig,
        removeFileFromSet,
        activeIndex,
        setActiveIndex,
        isDeleting,
        value,
      }}
    >
      <div ref={ref} className={cn('grid w-full gap-4', className)} {...props}>
        {children}
      </div>
    </FileUploaderContext.Provider>
  )
})

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, isDeleting, value } = useFileUpload()
  const [preview, setPreview] = useState<string | null>(null)
  
  const file = value?.[index]
  const isCurrentlyDeleting = isDeleting === index

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url) // Memory cleanup
  }, [file])

  if (!file) return null

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-square rounded-lg border bg-muted overflow-hidden group',
        isCurrentlyDeleting && 'opacity-50',
        className
      )}
      {...props}
    >
      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-2 text-center">
          <FileIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-[10px] truncate w-full px-1">{file.name}</p>
        </div>
      )}

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={isCurrentlyDeleting}
          onClick={(e) => {
            e.stopPropagation()
            removeFileFromSet(index)
          }}
          className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
        >
          {isCurrentlyDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
})

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload()
  
  if (isLOF) return null // Hide input if max files reached

  return (
    <div
      ref={ref}
      {...dropzoneState.getRootProps()}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer hover:bg-accent/50',
        dropzoneState.isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20',
        isFileTooBig && 'border-destructive bg-destructive/5',
        className
      )}
      {...props}
    >
      <Input {...dropzoneState.getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <CloudUpload className="h-10 w-10 text-muted-foreground" />
        {children}
      </div>
    </div>
  )
})