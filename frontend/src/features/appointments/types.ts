export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
export type MeetingType = 'chat' | 'audio' | 'video'

export interface AppointmentParty {
  _id: string
  name: string
  email: string
}

export interface Appointment {
  _id: string
  farmer: AppointmentParty
  expert: AppointmentParty
  requestedDate: string
  meetingType: MeetingType
  reason: string
  status: AppointmentStatus
  expertNotes?: string
  createdAt: string
}

export interface BookAppointmentInput {
  expertId: string
  requestedDate: string
  meetingType?: MeetingType
  reason: string
}

export interface ChatMessage {
  _id: string
  appointment: string
  sender: string
  text: string
  createdAt: string
}

export interface CallInfo {
  roomId: string
  meetingType: MeetingType
  status: AppointmentStatus
  note: string
}
