'use client'

import { useState } from 'react'
import { updateEventSettings } from '@/app/dashboard/events/[id]/actions'
import { DeleteEventForm } from '@/components/events/delete-event-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface EventSettingsFormProps {
    event: {
        id: string
        title: string
        location: string | null
        is_registration_open: boolean
    }
}

export function EventSettingsForm({ event }: EventSettingsFormProps) {
    const [title, setTitle] = useState(event.title)
    const [location, setLocation] = useState(event.location || '')
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(event.is_registration_open)
    const [isSaving, setIsSaving] = useState(false)
    const [isTogglingRegistration, setIsTogglingRegistration] = useState(false)

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await updateEventSettings(event.id, { title, location })
            toast.success("Event details updated successfully")
        } catch (error: any) {
            toast.error(error.message || "Failed to update event details")
        } finally {
            setIsSaving(false)
        }
    }

    const handleRegistrationToggle = async (checked: boolean) => {
        if (isTogglingRegistration || checked === isRegistrationOpen) return

        const message = checked
            ? 'Open registrations for this event? Coaches will be able to add new entries.'
            : 'Close registrations for this event? Coaches will no longer be able to add new entries.'

        const confirmed = window.confirm(message)
        if (!confirmed) return

        setIsTogglingRegistration(true)
        setIsRegistrationOpen(checked)
        try {
            await updateEventSettings(event.id, { is_registration_open: checked })
            toast.success(`Registration ${checked ? 'opened' : 'closed'} successfully`)
        } catch (error: any) {
            setIsRegistrationOpen(!checked) // Revert on failure
            toast.error(error.message || "Failed to update registration status")
        } finally {
            setIsTogglingRegistration(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Registration Status</CardTitle>
                    <CardDescription>Control whether new students can register for this event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Accept new entries</Label>
                            <p className="text-sm text-muted-foreground">
                                If closed, coaches will not be able to add new students to this event.
                            </p>
                        </div>
                        <Switch
                            checked={isRegistrationOpen}
                            onCheckedChange={handleRegistrationToggle}
                            disabled={isTogglingRegistration}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Update the basic details of your event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveGeneral} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Name</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g. Spring Karate Tournament"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Address / Location</Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="E.g. 123 Main St, City, ST 12345"
                            />
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save General Settings
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="danger-zone" className="border-destructive/20 border rounded-lg px-4 bg-destructive/5 overflow-hidden">
                    <AccordionTrigger className="text-destructive hover:text-destructive hover:no-underline py-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <AlertTriangle className="h-5 w-5" />
                            Advanced Options (Danger Zone)
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-md bg-background/50">
                            <div>
                                <h4 className="font-semibold text-foreground">Delete Event</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Permanently remove this event and all its associated data. This action cannot be undone.
                                </p>
                            </div>
                            <div className="shrink-0 flex justify-end">
                                <DeleteEventForm eventId={event.id} eventTitle={event.title} />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
