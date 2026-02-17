'use client'

import { useState } from 'react'
import { deleteEvent } from '@/app/dashboard/events/[id]/actions'
import { Button } from '@/components/ui/button'
import { PendingButton } from '@/components/ui/pending-button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MoreHorizontal, Trash2 } from 'lucide-react'

export function DeleteEventForm({ eventId, eventTitle }: { eventId: string; eventTitle?: string }) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const canDelete = confirmText.trim().toLowerCase() === 'delete'

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Event actions">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setConfirmOpen(true)}
                    >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete event
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={confirmOpen}
                onOpenChange={(open) => {
                    setConfirmOpen(open)
                    if (!open) setConfirmText('')
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete event?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. All related event data may be permanently removed.
                        </DialogDescription>
                    </DialogHeader>

                    {eventTitle ? (
                        <p className="rounded-md border border-black/10 bg-muted/40 px-3 py-2 text-xs dark:border-white/10">
                            Event: <span className="font-medium">{eventTitle}</span>
                        </p>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="delete-confirm">Type delete to confirm</Label>
                        <Input
                            id="delete-confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="delete"
                            autoComplete="off"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <form action={deleteEvent}>
                            <input type="hidden" name="eventId" value={eventId} />
                            <PendingButton
                                type="submit"
                                variant="destructive"
                                pendingText="Deleting..."
                                disabled={!canDelete}
                            >
                                Delete permanently
                            </PendingButton>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
