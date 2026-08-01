import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

// Connected once per login (see app/store.ts, which wires this to the auth
// slice), authenticated with the same access token used for REST calls.
export function connectSocket(token: string): Socket {
  if (socket) {
    socket.disconnect()
  }
  socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000', {
    auth: { token },
  })
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

export function getSocket(): Socket | null {
  return socket
}
