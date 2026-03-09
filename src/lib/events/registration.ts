type EventRegistrationState = {
    end_date?: string | null
    is_registration_open?: boolean | null
    registration_close_date?: string | null
}

export function isRegistrationClosed(
    event: EventRegistrationState,
    todayIso: string = new Date().toISOString().slice(0, 10)
) {
    const isPastEvent = !!event.end_date && event.end_date < todayIso
    const manuallyClosed = event.is_registration_open === false
    const closeDate = event.registration_close_date?.slice(0, 10)
    const closedByDate = !!closeDate && closeDate < todayIso

    return isPastEvent || manuallyClosed || closedByDate
}
