import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SaveIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { RadioTile } from "@/lib/somafm"

interface EditTileDialogProps {
  tile: RadioTile
  onSave: (tile: RadioTile) => void
  onClose: () => void
}

/** Форма редактирования плитки: название, обложка и URL потока. */
export function EditTileDialog({ tile, onSave, onClose }: EditTileDialogProps) {
  const [title, setTitle] = useState(tile.title)
  const [cover, setCover] = useState(tile.cover)
  const [stream, setStream] = useState(tile.stream)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit tile</DialogTitle>
          <DialogDescription>
            Cover and stream will be saved in your browser.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSave({
              ...tile,
              title: title.trim(),
              cover: cover.trim(),
              stream: stream.trim(),
            })
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Title
            </span>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Groove Salad"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Cover (URL)
            </span>
            <Input
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://…"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Stream (URL)
            </span>
            <Input
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              placeholder="https://…"
              required
            />
          </label>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" data-icon="inline-start">
              <HugeiconsIcon icon={SaveIcon} className="size-4" />
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
